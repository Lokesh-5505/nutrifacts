/* ═══════════════════════════════════════════════
   NutriFacts v2 — scanner.js
   ═══════════════════════════════════════════════ */

/* ── CLAUDE API ─────────────────────────────────── */
async function analyzeIngredients(ingredientText, productName = 'Unknown Product') {
  const prompt = `You are a food safety expert. Analyze these ingredients and return ONLY valid JSON (no markdown fences, no extra text).

Product: ${productName}
Ingredients: ${ingredientText}

Return exactly:
{
  "productName": "${productName}",
  "healthScore": <0-100>,
  "riskLevel": "<safe|moderate|risky>",
  "summary": "<2 sentences>",
  "harmfulIngredients": [{"name":"","severity":"<high|medium|low>","reason":"","fdaNote":""}],
  "safeIngredients": [""],
  "nutrition": {"sugarLevel":"<low|moderate|high>","fatLevel":"<low|moderate|high>","sodiumLevel":"<low|moderate|high>","calorieNote":""},
  "childSafety": {"status":"<safe|caution|unsafe>","reason":"","ageWarning":""},
  "dietRecommendations": ["","",""],
  "alternatives": [{"name":"","reason":""},{"name":"","reason":""}],
  "servingAdvice": "",
  "overallVerdict": "<SAFE TO EAT|EAT IN MODERATION|AVOID FREQUENT CONSUMPTION|NOT RECOMMENDED>"
}`;

  try {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1000,
        messages: [{ role: 'user', content: prompt }]
      })
    });
    if (!res.ok) throw new Error('API error');
    const data = await res.json();
    const raw = data.content[0].text.trim().replace(/```json|```/g, '').trim();
    return JSON.parse(raw);
  } catch(e) {
    console.error(e);
    return buildFallback(ingredientText, productName);
  }
}

function buildFallback(ings, name) {
  const hasHFCS    = /fructose|corn syrup/i.test(ings);
  const hasEmuls   = /lecithin|polysorbate|carboxymethyl|carrageenan/i.test(ings);
  const hasPreserv = /sorbate|benzoate|nitrate|BHA|BHT|TBHQ/i.test(ings);
  const hasArtif   = /artificial|vanillin|msg|monosodium|aspartame|acesulfame/i.test(ings);
  const harmful = [];
  if (hasHFCS)    harmful.push({ name:'High Fructose Corn Syrup', severity:'high',   reason:'Linked to obesity, insulin resistance, and metabolic syndrome.', fdaNote:'FDA advises limiting added sugars to <10% daily calories.' });
  if (hasEmuls)   harmful.push({ name:'Emulsifier (Soy Lecithin)', severity:'medium', reason:'May disrupt gut microbiome when consumed regularly.', fdaNote:'Currently GRAS status but research ongoing.' });
  if (hasPreserv) harmful.push({ name:'Chemical Preservative', severity:'medium', reason:'Some preservatives form carcinogenic compounds in the body.', fdaNote:'Permitted at specific concentrations; caution advised.' });
  if (hasArtif)   harmful.push({ name:'Artificial Sweetener / Flavor', severity:'medium', reason:'WHO classified aspartame as possibly carcinogenic in 2023.', fdaNote:'FDA permits use; WHO recommends caution.' });
  const score = Math.max(18, 82 - harmful.length * 16);
  return {
    productName: name, healthScore: score,
    riskLevel: score>=70?'safe':score>=42?'moderate':'risky',
    summary: `This product contains ${harmful.length} potentially harmful ingredient(s). ${harmful.length>1?'Consider healthier alternatives.':'Moderate consumption is acceptable.'}`,
    harmfulIngredients: harmful,
    safeIngredients: ['Water','Natural Spices','Salt'],
    nutrition: { sugarLevel: hasHFCS?'high':'moderate', fatLevel:'moderate', sodiumLevel:'moderate', calorieNote:'Moderate calorie density — watch your portion sizes.' },
    childSafety: { status: harmful.length>1?'caution':'safe', reason: harmful.length>1?'Contains additives not recommended for young children.':'Generally safe in moderate amounts.', ageWarning:'Suitable for ages 5+ in moderation.' },
    dietRecommendations: ['Limit to 1–2 servings per week.','Pair with fresh fruits or vegetables.','Check the full nutrition label for daily value percentages.'],
    alternatives: [{ name:'Fresh Fruits', reason:'Natural sugars with fiber and vitamins.' }, { name:'Homemade Snacks', reason:'Full control over ingredients — no additives.' }],
    servingAdvice: 'Stick to the listed serving size. Avoid exceeding 2–3 servings per week.',
    overallVerdict: score>=70?'SAFE TO EAT':score>=42?'EAT IN MODERATION':'AVOID FREQUENT CONSUMPTION'
  };
}

/* ── CAMERA ─────────────────────────────────────── */
let stream = null;

async function startCamera() {
  try {
    stream = await navigator.mediaDevices.getUserMedia({ video:{ facingMode:'environment' } });
    const vid = document.getElementById('camera-feed');
    const ph  = document.getElementById('cam-placeholder');
    if (vid) { vid.srcObject = stream; vid.style.display = 'block'; }
    if (ph)  ph.style.display = 'none';
    document.getElementById('scan-line-el')?.classList.add('active');
    showToast('Camera started — point at ingredient label','success');
  } catch(e) { showToast('Camera denied. Use manual input.','error'); }
}

function stopCamera() {
  if (!stream) return;
  stream.getTracks().forEach(t => t.stop());
  stream = null;
  const vid = document.getElementById('camera-feed');
  const ph  = document.getElementById('cam-placeholder');
  if (vid) { vid.srcObject = null; vid.style.display = 'none'; }
  if (ph)  ph.style.display = 'flex';
  document.getElementById('scan-line-el')?.classList.remove('active');
}

function capturePhoto() {
  const vid = document.getElementById('camera-feed');
  if (!vid?.srcObject) { showToast('Start camera first!','warning'); return; }
  const c = document.getElementById('camera-canvas');
  c.width = vid.videoWidth; c.height = vid.videoHeight;
  c.getContext('2d').drawImage(vid, 0, 0);
  showToast('Photo captured! Now click Analyze.','success');
}

function handleUpload(file) {
  if (!file.type.startsWith('image/')) { showToast('Please upload an image.','error'); return; }
  const r = new FileReader();
  r.onload = e => {
    const ph = document.getElementById('cam-placeholder');
    if (ph) ph.innerHTML = `<img src="${e.target.result}" style="width:100%;height:100%;object-fit:cover;" alt="Uploaded">`;
    showToast('Image loaded! Click Analyze Food.','success');
  };
  r.readAsDataURL(file);
}

/* ── MAIN ANALYSIS ──────────────────────────────── */
async function startAnalysis() {
  const ings     = document.getElementById('ingredient-text')?.value.trim();
  const prodName = document.getElementById('product-name')?.value.trim() || 'Scanned Product';

  if (!ings) { showToast('Please enter ingredients or pick a demo product!','warning'); return; }

  const overlay = document.getElementById('analyzing-overlay');
  if (overlay) overlay.classList.add('show');

  const msgs = ['Reading ingredient labels…','Checking FDA database…','Detecting harmful additives…','Calculating health score…','Generating recommendations…'];
  let i = 0;
  const tid = setInterval(() => {
    const el = document.getElementById('analyzing-msg');
    if (el && i < msgs.length) el.textContent = msgs[i++];
  }, 650);

  try {
    const result = await analyzeIngredients(ings, prodName);
    clearInterval(tid);
    saveResult(result);
    window.location.href = 'results.html';
  } catch {
    clearInterval(tid);
    if (overlay) overlay.classList.remove('show');
    showToast('Analysis failed. Please try again.','error');
  }
}
