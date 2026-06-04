# منشأة هرم الصاغة للذهب والتحييف | Pyramids Gold Assayer & Calibration Platform

هذا الملف يحتوي على الوصف التفصيلي والبرومبت الكامل لبناء وإعادة توليد هذا المشروع الفاخر والمتميز من الصفر.

---

## 1. وصف المشروع بالعربية (Project Description in Arabic)

**منصة هرم الصاغة (Pyramids Gold)** هي لوحة تحكم سحابية مالية وثنائية اللغة (عربي/إنجليزي) بالغة الدقة والديكور البصري، صُممت خصيصاً لتلبية احتياجات الصاغة، وتجار الذهب كسر، والمستثمرين، والشيشنجية في السوق المصرية والأسواق العربية. تدمج المنصة بين عراقة الفن التقليدي للذهب في مصر والهندسة الرياضية المتقدمة لتقييف وتحييف الأوزان والعيارات المتنوعة وتحويلها آلياً إلى مكافئ عيار 21 (العيار القياسي الذهبي للذهب الكسر في مصر وسوق الجملة).

### المميزات الرئيسية:
1. **شاشة بصرية تفاعلية رئيسية (Bloomberg-style UI)**:
   - تصميم Bento Grid غلاسمورفيك مع تألق ذهبي وتأثيرات حركية فائقة التميز.
   - كروت تفاعلية للأوزان المسجلة، المكافئ الصافي لجرام 21، والقيمة المالية الإجمالية التقريبية لغلاف الثروة.
   - بث تسعير الأونصة الفوري المباشر مع دعم التبديل التلقائي لمصادر التغذية (MSN Money, GoldAPI, FreeGoldPrice, MetalPriceAPI).
   - رسم بياني حي (Sparkline Vector Graph Interface) بالرسوم الشعاعية لمراقبة حركات صعود وهبوط الأونصة عالمياً في بث لحظي.

2. **حاسبة التحييف الاحترافية (Professional Calibration)**:
   - نظام يعادل بدقة الأوزان المتنوعة ذات الأسهم العرفية (Shares out of 1000) وعيارت الذهب المختلفة (من عيار 9 إلى عيار 24).
   - تحويل فوري لصافي المكافئ من عيار 21 ومكافئ الذهب بندق عيار 24.
   - لوحة أرقام تكتيكية (Tactile virtual keypad) مستوحاة من الآلات الاحترافية لسهولة العمل الميداني بالصاغة.

3. **حاسبة بلدي وسعر الصافية والخصم المباشر (Baladi Fast Cash Calc)**:
   - حاسبة سريعة مخصصة للمعاملات العرفية اليومية المباشرة بصالات العرض: `(الوزن الرقمي × سعر الجرام) - قيمة الخصم المباشر بالجنيه المصري` للحصول على الصافي النهائي المطلوب فوراً.

4. **قسم ذكاء السيرفرات وأنظمة الجودة (AI & Systems)**:
   - شاشة تفاعلية تدمج الرموز الكيميائية والفيزيائية للمعادن الداخلة في صناعة الذهب وسهم الخلط الناري والدمغ (النحاس، الفضة، البلاتين، البالاديوم، الرصاص، الروديوم).
   - جدول عيارات الذهب الكاملة الممتدة من عيار 9K إلى 24K مع توضيح عدد الأسهم الدقيقة لكل عيار (من أصل 1000 سهم) ونسبة النقاء التامة لتسهيل مطابقة أختام مصلحة الدمغة والموازين.

5. **تصدير إكسل متكامل (Microsoft Excel Export Tool)**:
   - أداة متطورة تصدر كافة الحسابات والعمليات السابقة كملف CSV مهيأ بالبوم (Unicode BOM) لحفظ اللغة العربية وهيكلتها داخل Microsoft Excel بشكل سليم وبدون تشفير تالف.

---

## 2. البرومبت الكامل لإعادة بناء المشروع (Full Blueprint Prompt)

يمكن استخدام البرومبت التالي لتوجيه الذكاء الاصطناعي لتصميم وبناء هذا التطبيق بالتفصيل:

```text
Act as a world-class financial software architect and specialized front-end designer. Your task is to build a premium, Bloomberg-style, highly responsive bilingual (Arabic/English) platform named "Pyramids Gold Assayer & Calibration Platform" (هرم الصاغة) using React, TypeScript, and Tailwind CSS.

### 🎨 DESIGN & VISUAL THEME
- Implement a dark luxury aesthetic (Midnight slate background, glowing gold accents, glassmorphic bento cards with borders of 12% border-amber-500/20, and sharp typography).
- Primary Font: use "Inter" or "Space Grotesk". For technical numbers and tickers, use "JetBrains Mono" or a tech monospace font.
- Animation: Use subtle micro-animations for hover states, floating cards, real-time pulse triggers, and glowing state indicators. Use "motion/react" for transition flows.
- Icons: Exclusively use lucide-react. Do not write custom SVG markers unless for dynamic vector sparkline metrics.

### 📊 REGULATORY & MATHEMATICAL PRINCIPLES (GOLD CALIPERS FORMULAS)
- Standard Assaying conversion logic (Shishangi formula) uses shares divided by 875 (21K metric standard in the Middle East):
  Equivalent Gold 21K = (Raw Weight × Shares) / 875
- Fine Gold 24K equivalent:
  Fine Gold 24K = (Raw Weight × Shares) / 1000
- Support all custom gold carats and points from 9K to 24K with their official shares mapped as:
  * 24K = 1000 shares (100% Purity)
  * 22K = 916.7 shares (91.67%)
  * 21K = 875.0 shares (87.50%)
  * 18K = 750.0 shares (75.00%)
  * 14K = 583.3 shares (58.33%)
  * 12K = 500.0 shares (50.00%)
  * 9K  = 375.0 shares (37.50%)

### 🛠️ PLATFORM FUNCTIONAL MODULES
1. **Welcome Bento Hero Card & Interactive Live Feed**:
   - Welcome message based on selected language (Arabic / English).
   - Display a fallback fallback vector emblem if the brand logo fails to render, showing a golden pyramid with "XAU" written on it.
   - MSN Secure Money pricing API simulator + GoldAPI + freegoldprice + metalpriceapi togglers.
   - Direct interactive sparkline vector (dynamic inline SVG) mapping the current price action (simulated real-time fluctuations of $3-5 around standard spot rates).

2. **Unified Navigation & Header**:
   - Desktop responsive sidebar with gold gradients.
   - Soft mobile bottom navigation bar (Home, Calibration, Fast Calc / Baladi Calc, System Info, Master Settings).
   - Quick language switcher (AR/EN) in the master header.

3. **Advanced Calibration Engine**:
   - Professional form to calculate gold bullion scrap weights, purity share, custom caliber selection, and direct conversion to 21K / 24K equivalents.
   - A fully touch-compatible modern virtual on-screen numpad for seamless workshop data entry.
   - Local transactional database logging all calibrations to localStorage with instant stats update.

4. **"Baladi" Cash Flow Calculator**:
   - Over-the-counter calculator to multiply scrap weight by gold price and deduct hand-negotiated discount cash in Egyptian Pounds: `(Weight * Cost) - Cash Discount = Net Value`.

5. **Server Intelligence & Chem Charts**:
   - Visual reference grid of chemical components used in metallurgy (Gold: Au, Silver: Ag, Copper: Cu, Palladium: Pd, Platinum: Pt, Rhodium: Rh).
   - Complete 9K to 24K gold Carat shares table outlining shares per 1000, karat equivalents, and fine gold percentage fractions.

6. **Spreadsheet Excel Synchronizer**:
   - Secure button that exports the entire list of transactions with UTF-8 BOM encoding to guarantee seamless support for Arabic characters inside Excel.
```

---
*هذه الوثيقة مرجع مستمر للتحسين والتطوير المستقبلي.*
