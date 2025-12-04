function l(t,n){return[t[0]*n[0]+t[1]*n[1]+t[2]*n[2],t[3]*n[0]+t[4]*n[1]+t[5]*n[2],t[6]*n[0]+t[7]*n[1]+t[8]*n[2]]}const Q=[.955473421488075,-.02309845494876471,.06325924320057072,-.0283697093338637,1.0099953980813041,.021041441191917323,.012314014864481998,-.020507649298898964,1.330365926242124];/**
 * Bradford chromatic adaptation from D50 to D65
 *
 * @license W3C https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document
 * @copyright This software or document includes material copied from or derived from https://github.com/w3c/csswg-drafts/blob/main/css-color-4/conversions.js. Copyright © 2022 W3C® (MIT, ERCIM, Keio, Beihang).
 */function s(t){return l(Q,t)}const U=[1.0479297925449969,.022946870601609652,-.05019226628920524,.02962780877005599,.9904344267538799,-.017073799063418826,-.009243040646204504,.015055191490298152,.7518742814281371];/**
 * Bradford chromatic adaptation from D65 to D50
 * @license W3C https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document
 * @copyright This software or document includes material copied from or derived from https://github.com/w3c/csswg-drafts/blob/main/css-color-4/conversions.js. Copyright © 2022 W3C® (MIT, ERCIM, Keio, Beihang).
 * @see http://www.brucelindbloom.com/index.html?Eqn_ChromAdapt.html
 */function h(t){return l(U,t)}/**
 * @param {number} hue - Hue as degrees 0..360
 * @param {number} sat - Saturation as percentage 0..100
 * @param {number} light - Lightness as percentage 0..100
 * @return {number[]} Array of sRGB components; in-gamut colors in range [0..1]
 *
 * @license W3C https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document
 * @copyright This software or document includes material copied from or derived from https://github.com/w3c/csswg-drafts/blob/main/css-color-4/hslToRgb.js. Copyright © 2022 W3C® (MIT, ERCIM, Keio, Beihang).
 * @see https://github.com/w3c/csswg-drafts/blob/main/css-color-4/hslToRgb.js
 */function C(t){let n=t[0]%360;const e=t[1]/100,o=t[2]/100;return n<0&&(n+=360),[X(0,n,e,o),X(8,n,e,o),X(4,n,e,o)]}function X(t,n,e,o){const r=(t+n/30)%12;return o-e*Math.min(o,1-o)*Math.max(-1,Math.min(r-3,9-r,1))}/**
 * @param {number} hue -  Hue as degrees 0..360
 * @param {number} white -  Whiteness as percentage 0..100
 * @param {number} black -  Blackness as percentage 0..100
 * @return {number[]} Array of RGB components 0..1
 *
 * @license W3C https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document
 * @copyright This software or document includes material copied from or derived from https://github.com/w3c/csswg-drafts/blob/main/css-color-4/hwbToRgb.js. Copyright © 2022 W3C® (MIT, ERCIM, Keio, Beihang).
 * @see https://github.com/w3c/csswg-drafts/blob/main/css-color-4/hwbToRgb.js
 */function V(t){const n=t[0],e=t[1]/100,o=t[2]/100;if(e+o>=1){const a=e/(e+o);return[a,a,a]}const r=C([n,100,50]),u=1-e-o;return[r[0]*u+e,r[1]*u+e,r[2]*u+e]}/**
 * @license W3C https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document
 * @copyright This software or document includes material copied from or derived from https://github.com/w3c/csswg-drafts/blob/main/css-color-4/conversions.js. Copyright © 2022 W3C® (MIT, ERCIM, Keio, Beihang).
 */function $(t){const n=t[2]*Math.PI/180;return[t[0],t[1]*Math.cos(n),t[1]*Math.sin(n)]}/**
 * @license W3C https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document
 * @copyright This software or document includes material copied from or derived from https://github.com/w3c/csswg-drafts/blob/main/css-color-4/conversions.js. Copyright © 2022 W3C® (MIT, ERCIM, Keio, Beihang).
 */function n1(t){const n=180*Math.atan2(t[2],t[1])/Math.PI;return[t[0],Math.sqrt(Math.pow(t[1],2)+Math.pow(t[2],2)),n>=0?n:n+360]}const m=[.3457/.3585,1,.2958/.3585];/**
 * Convert Lab to D50-adapted XYZ
 * @license W3C https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document
 * @copyright This software or document includes material copied from or derived from https://github.com/w3c/csswg-drafts/blob/main/css-color-4/conversions.js. Copyright © 2022 W3C® (MIT, ERCIM, Keio, Beihang).
 * @see http://www.brucelindbloom.com/index.html?Eqn_RGB_XYZ_Matrix.html
 */function N(t){const n=903.2962962962963,e=216/24389,o=(t[0]+16)/116,r=t[1]/500+o,u=o-t[2]/200;return[(Math.pow(r,3)>e?Math.pow(r,3):(116*r-16)/n)*m[0],(t[0]>8?Math.pow((t[0]+16)/116,3):t[0]/n)*m[1],(Math.pow(u,3)>e?Math.pow(u,3):(116*u-16)/n)*m[2]]}/**
 * @license W3C https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document
 * @copyright This software or document includes material copied from or derived from https://github.com/w3c/csswg-drafts/blob/main/css-color-4/conversions.js. Copyright © 2022 W3C® (MIT, ERCIM, Keio, Beihang).
 * @see https://github.com/w3c/csswg-drafts/blob/main/css-color-4/conversions.js
 */function d(t){const n=t[2]*Math.PI/180;return[t[0],t[1]*Math.cos(n),t[1]*Math.sin(n)]}/**
 * @license W3C https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document
 * @copyright This software or document includes material copied from or derived from https://github.com/w3c/csswg-drafts/blob/main/css-color-4/conversions.js. Copyright © 2022 W3C® (MIT, ERCIM, Keio, Beihang).
 * @see https://github.com/w3c/csswg-drafts/blob/main/css-color-4/conversions.js
 */function S(t){const n=180*Math.atan2(t[2],t[1])/Math.PI;return[t[0],Math.sqrt(t[1]**2+t[2]**2),n>=0?n:n+360]}const t1=[1.2268798758459243,-.5578149944602171,.2813910456659647,-.0405757452148008,1.112286803280317,-.0717110580655164,-.0763729366746601,-.4214933324022432,1.5869240198367816],e1=[1,.3963377773761749,.2158037573099136,1,-.1055613458156586,-.0638541728258133,1,-.0894841775298119,-1.2914855480194092];/**
 * Given OKLab, convert to XYZ relative to D65
 *
 * @license W3C https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document
 * @copyright This software or document includes material copied from or derived from https://github.com/w3c/csswg-drafts/blob/main/css-color-4/conversions.js. Copyright © 2022 W3C® (MIT, ERCIM, Keio, Beihang).
 * @see https://github.com/w3c/csswg-drafts/blob/main/css-color-4/conversions.js
 */function Y(t){const n=l(e1,t);return l(t1,[n[0]**3,n[1]**3,n[2]**3])}/**
 * Assuming XYZ is relative to D50, convert to CIE Lab
 * from CIE standard, which now defines these as a rational fraction
 *
 * @license W3C https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document
 * @copyright This software or document includes material copied from or derived from https://github.com/w3c/csswg-drafts/blob/main/css-color-4/conversions.js. Copyright © 2022 W3C® (MIT, ERCIM, Keio, Beihang).
 */function I(t){const n=Z(t[0]/m[0]),e=Z(t[1]/m[1]);return[116*e-16,500*(n-e),200*(e-Z(t[2]/m[2]))]}const o1=216/24389,r1=24389/27;function Z(t){return t>o1?Math.cbrt(t):(r1*t+16)/116}const a1=[.819022437996703,.3619062600528904,-.1288737815209879,.0329836539323885,.9292868615863434,.0361446663506424,.0481771893596242,.2642395317527308,.6335478284694309],u1=[.210454268309314,.7936177747023054,-.0040720430116193,1.9779985324311684,-2.42859224204858,.450593709617411,.0259040424655478,.7827717124575296,-.8086757549230774];/**
 * @license W3C https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document
 * @copyright This software or document includes material copied from or derived from https://github.com/w3c/csswg-drafts/blob/main/css-color-4/conversions.js. Copyright © 2022 W3C® (MIT, ERCIM, Keio, Beihang).
 *
 * XYZ <-> LMS matrices recalculated for consistent reference white
 * @see https://github.com/w3c/csswg-drafts/issues/6642#issuecomment-943521484
 */function k(t){const n=l(a1,t);return l(u1,[Math.cbrt(n[0]),Math.cbrt(n[1]),Math.cbrt(n[2])])}const i1=[30757411/17917100,-6372589/17917100,-4539589/17917100,-.666684351832489,1.616481236634939,467509/29648200,792561/44930125,-1921689/44930125,.942103121235474];/**
 * Convert XYZ to linear-light rec2020
 *
 * @license W3C https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document
 * @copyright This software or document includes material copied from or derived from https://github.com/w3c/csswg-drafts/blob/main/css-color-4/conversions.js. Copyright © 2022 W3C® (MIT, ERCIM, Keio, Beihang).
 */const c1=[446124/178915,-333277/357830,-72051/178915,-14852/17905,63121/35810,423/17905,11844/330415,-50337/660830,316169/330415];/**
 * Convert XYZ to linear-light P3
 *
 * @license W3C https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document
 * @copyright This software or document includes material copied from or derived from https://github.com/w3c/csswg-drafts/blob/main/css-color-4/conversions.js. Copyright © 2022 W3C® (MIT, ERCIM, Keio, Beihang).
 */function y(t){return l(c1,t)}const _1=[1.3457868816471583,-.25557208737979464,-.05110186497554526,-.5446307051249019,1.5082477428451468,.02052744743642139,0,0,1.2119675456389452];/**
 * Convert D50 XYZ to linear-light prophoto-rgb
 *
 * @license W3C https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document
 * @copyright This software or document includes material copied from or derived from https://github.com/w3c/csswg-drafts/blob/main/css-color-4/conversions.js. Copyright © 2022 W3C® (MIT, ERCIM, Keio, Beihang).
 * @see http://www.brucelindbloom.com/index.html?Eqn_RGB_XYZ_Matrix.html
 */const l1=[1829569/896150,-506331/896150,-308931/896150,-851781/878810,1648619/878810,36519/878810,16779/1248040,-147721/1248040,1266979/1248040];/**
 * Convert XYZ to linear-light a98-rgb
 *
 * @license W3C https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document
 * @copyright This software or document includes material copied from or derived from https://github.com/w3c/csswg-drafts/blob/main/css-color-4/conversions.js. Copyright © 2022 W3C® (MIT, ERCIM, Keio, Beihang).
 */const s1=[12831/3959,-329/214,-1974/3959,-851781/878810,1648619/878810,36519/878810,705/12673,-2585/12673,705/667];/**
 * @license W3C https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document
 * @copyright This software or document includes material copied from or derived from https://github.com/w3c/csswg-drafts/blob/main/css-color-4/conversions.js. Copyright © 2022 W3C® (MIT, ERCIM, Keio, Beihang).
 */function g(t){return l(s1,t)}/**
 * Convert an array of linear-light rec2020 RGB  in the range 0.0-1.0
 * to gamma corrected form ITU-R BT.2020-2 p.4
 *
 * @license W3C https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document
 * @copyright This software or document includes material copied from or derived from https://github.com/w3c/csswg-drafts/blob/main/css-color-4/conversions.js. Copyright © 2022 W3C® (MIT, ERCIM, Keio, Beihang).
 */const W=1.09929682680944,h1=.018053968510807;function D(t){const n=t<0?-1:1,e=Math.abs(t);return e>h1?n*(W*Math.pow(e,.45)-(W-1)):4.5*t}/**
 * Convert an array of linear-light sRGB values in the range 0.0-1.0 to gamma corrected form
 * Extended transfer function:
 *  For negative values, linear portion extends on reflection
 *  of axis, then uses reflected pow below that
 *
 * @license W3C https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document
 * @copyright This software or document includes material copied from or derived from https://github.com/w3c/csswg-drafts/blob/main/css-color-4/conversions.js. Copyright © 2022 W3C® (MIT, ERCIM, Keio, Beihang).
 * @see https://en.wikipedia.org/wiki/SRGB
 */function b(t){return[L(t[0]),L(t[1]),L(t[2])]}function L(t){const n=t<0?-1:1,e=Math.abs(t);return e>.0031308?n*(1.055*Math.pow(e,1/2.4)-.055):12.92*t}/**
 * Convert an array of linear-light display-p3 RGB in the range 0.0-1.0
 * to gamma corrected form
 *
 * @license W3C https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document
 * @copyright This software or document includes material copied from or derived from https://github.com/w3c/csswg-drafts/blob/main/css-color-4/conversions.js. Copyright © 2022 W3C® (MIT, ERCIM, Keio, Beihang).
 */function T(t){return b(t)}/**
 * Convert an array of linear-light prophoto-rgb in the range 0.0-1.0
 * to gamma corrected form.
 * Transfer curve is gamma 1.8 with a small linear portion.
 *
 * @license W3C https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document
 * @copyright This software or document includes material copied from or derived from https://github.com/w3c/csswg-drafts/blob/main/css-color-4/conversions.js. Copyright © 2022 W3C® (MIT, ERCIM, Keio, Beihang).
 */const f1=1/512;function B(t){const n=t<0?-1:1,e=Math.abs(t);return e>=f1?n*Math.pow(e,1/1.8):16*t}/**
 * Convert an array of linear-light a98-rgb in the range 0.0-1.0
 * to gamma corrected form. Negative values are also now accepted
 *
 * @license W3C https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document
 * @copyright This software or document includes material copied from or derived from https://github.com/w3c/csswg-drafts/blob/main/css-color-4/conversions.js. Copyright © 2022 W3C® (MIT, ERCIM, Keio, Beihang).
 */function G(t){const n=t<0?-1:1,e=Math.abs(t);return n*Math.pow(e,256/563)}/**
 * Convert an array of rec2020 RGB values in the range 0.0 - 1.0
 * to linear light (un-companded) form.
 * ITU-R BT.2020-2 p.4
 *
 * @license W3C https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document
 * @copyright This software or document includes material copied from or derived from https://github.com/w3c/csswg-drafts/blob/main/css-color-4/conversions.js. Copyright © 2022 W3C® (MIT, ERCIM, Keio, Beihang).
 */const j=1.09929682680944,m1=.018053968510807;function v(t){const n=t<0?-1:1,e=Math.abs(t);return e<4.5*m1?t/4.5:n*Math.pow((e+j-1)/j,1/.45)}const d1=[63426534/99577255,20160776/139408157,47086771/278816314,26158966/99577255,.677998071518871,8267143/139408157,0,19567812/697040785,1.0609850577107909];/**
 * Convert an array of linear-light rec2020 values to CIE XYZ
 * using  D65 (no chromatic adaptation)
 *
 * @license W3C https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document
 * @copyright This software or document includes material copied from or derived from https://github.com/w3c/csswg-drafts/blob/main/css-color-4/conversions.js. Copyright © 2022 W3C® (MIT, ERCIM, Keio, Beihang).
 * @see http://www.brucelindbloom.com/index.html?Eqn_RGB_XYZ_Matrix.html
 *//**
 * Convert an array of of sRGB values where in-gamut values are in the range
 * [0 - 1] to linear light (un-companded) form.
 * Extended transfer function:
 *  For negative values, linear portion is extended on reflection of axis,
 *  then reflected power function is used.
 *
 * @license W3C https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document
 * @copyright This software or document includes material copied from or derived from https://github.com/w3c/csswg-drafts/blob/main/css-color-4/conversions.js. Copyright © 2022 W3C® (MIT, ERCIM, Keio, Beihang).
 * @see https://en.wikipedia.org/wiki/SRGB
 */function M(t){return[P(t[0]),P(t[1]),P(t[2])]}function P(t){const n=t<0?-1:1,e=Math.abs(t);return e<=.04045?t/12.92:n*Math.pow((e+.055)/1.055,2.4)}/**
 * Convert an array of display-p3 RGB values in the range 0.0 - 1.0
 * to linear light (un-companded) form.
 *
 * @license W3C https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document
 * @copyright This software or document includes material copied from or derived from https://github.com/w3c/csswg-drafts/blob/main/css-color-4/conversions.js. Copyright © 2022 W3C® (MIT, ERCIM, Keio, Beihang).
 */function z(t){return M(t)}const g1=[608311/1250200,189793/714400,198249/1000160,35783/156275,247089/357200,198249/2500400,0,32229/714400,5220557/5000800];/**
 * Convert an array of linear-light display-p3 values to CIE XYZ
 * using D65 (no chromatic adaptation)
 *
 * @license W3C https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document
 * @copyright This software or document includes material copied from or derived from https://github.com/w3c/csswg-drafts/blob/main/css-color-4/conversions.js. Copyright © 2022 W3C® (MIT, ERCIM, Keio, Beihang).
 * @see http://www.brucelindbloom.com/index.html?Eqn_RGB_XYZ_Matrix.html
 */function R(t){return l(g1,t)}/**
 * Convert an array of prophoto-rgb values where in-gamut Colors are in the
 * range [0.0 - 1.0] to linear light (un-companded) form. Transfer curve is
 * gamma 1.8 with a small linear portion. Extended transfer function
 *
 * @license W3C https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document
 * @copyright This software or document includes material copied from or derived from https://github.com/w3c/csswg-drafts/blob/main/css-color-4/conversions.js. Copyright © 2022 W3C® (MIT, ERCIM, Keio, Beihang).
 */const b1=16/512;function H(t){const n=t<0?-1:1,e=Math.abs(t);return e<=b1?t/16:n*Math.pow(e,1.8)}const M1=[.7977666449006423,.13518129740053308,.0313477341283922,.2880748288194013,.711835234241873,8993693872564e-17,0,0,.8251046025104602];/**
 * Convert an array of linear-light prophoto-rgb values to CIE D50 XYZ.
 * Matrix cannot be expressed in rational form, but is calculated to 64 bit accuracy.
 *
 * @license W3C https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document
 * @copyright This software or document includes material copied from or derived from https://github.com/w3c/csswg-drafts/blob/main/css-color-4/conversions.js. Copyright © 2022 W3C® (MIT, ERCIM, Keio, Beihang).
 * @see see https://github.com/w3c/csswg-drafts/issues/7675
 */function q(t){const n=t<0?-1:1,e=Math.abs(t);return n*Math.pow(e,563/256)}const p1=[573536/994567,263643/1420810,187206/994567,591459/1989134,6239551/9945670,374412/4972835,53769/1989134,351524/4972835,4929758/4972835];/**
 * Convert an array of linear-light a98-rgb values to CIE XYZ
 * http://www.brucelindbloom.com/index.html?Eqn_RGB_XYZ_Matrix.html
 * has greater numerical precision than section 4.3.5.3 of
 * https://www.adobe.com/digitalimag/pdfs/AdobeRGB1998.pdf
 * but the values below were calculated from first principles
 * from the chromaticity coordinates of R G B W
 *
 * @license W3C https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document
 * @copyright This software or document includes material copied from or derived from https://github.com/w3c/csswg-drafts/blob/main/css-color-4/conversions.js. Copyright © 2022 W3C® (MIT, ERCIM, Keio, Beihang).
 * @see http://www.brucelindbloom.com/index.html?Eqn_RGB_XYZ_Matrix.html
 * @see https://www.adobe.com/digitalimag/pdfs/AdobeRGB1998.pdf
 * @see https://github.com/w3c/csswg-drafts/blob/main/css-color-4/matrixmaker.html
 */const w1=[506752/1228815,87881/245763,12673/70218,87098/409605,175762/245763,12673/175545,7918/409605,87881/737289,1001167/1053270];/**
 * Convert an array of linear-light sRGB values to CIE XYZ
 * using sRGB's own white, D65 (no chromatic adaptation)
 *
 * @license W3C https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document
 * @copyright This software or document includes material copied from or derived from https://github.com/w3c/csswg-drafts/blob/main/css-color-4/conversions.js. Copyright © 2022 W3C® (MIT, ERCIM, Keio, Beihang).
 */function p(t){return l(w1,t)}/**
 * Convert an array of gamma-corrected sRGB values in the 0.0 to 1.0 range to HSL.
 *
 * @param {Color} RGB [r, g, b]
 * - Red component 0..1
 * - Green component 0..1
 * - Blue component 0..1
 * @return {number[]} Array of HSL values: Hue as degrees 0..360, Saturation and Lightness as percentages 0..100
 *
 * @license W3C https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document
 * @copyright This software or document includes material copied from or derived from https://github.com/w3c/csswg-drafts/blob/main/css-color-4/utilities.js. Copyright © 2022 W3C® (MIT, ERCIM, Keio, Beihang).
 *
 * @see https://github.com/w3c/csswg-drafts/blob/main/css-color-4/better-rgbToHsl.js
 */function X1(t){const n=t[0],e=t[1],o=t[2],r=Math.max(n,e,o),u=Math.min(n,e,o),a=(u+r)/2,i=r-u;let c=Number.NaN,_=0;if(Math.round(1e5*i)!==0){const f=Math.round(1e5*a);switch(_=f===0||f===1e5?0:(r-a)/Math.min(a,1-a),r){case n:c=(e-o)/i+(e<o?6:0);break;case e:c=(o-n)/i+2;break;case o:c=(n-e)/i+4}c*=60}return _<0&&(c+=180,_=Math.abs(_)),c>=360&&(c-=360),[c,100*_,100*a]}function Y1(t){const n=t[0],e=t[1],o=t[2],r=Math.max(n,e,o),u=Math.min(n,e,o);let a=Number.NaN;const i=r-u;if(i!==0){switch(r){case n:a=(e-o)/i+(e<o?6:0);break;case e:a=(o-n)/i+2;break;case o:a=(n-e)/i+4}a*=60}return a>=360&&(a-=360),a}function Z1(t){let n=t;return n=M(n),n=p(n),n=h(n),n}function k1(t){let n=t;return n=s(n),n=g(n),n=b(n),n}function y1(t){let n=t;return n=C(n),n=M(n),n=p(n),n=h(n),n}function D1(t){let n=t;return n=s(n),n=g(n),n=b(n),n=X1(n),n}function L1(t){let n=t;return n=V(n),n=M(n),n=p(n),n=h(n),n}function B1(t){let n=t;n=s(n),n=g(n);const e=b(n),o=Math.min(e[0],e[1],e[2]),r=1-Math.max(e[0],e[1],e[2]);return[Y1(e),100*o,100*r]}function G1(t){let n=t;return n=N(n),n}function v1(t){let n=t;return n=I(n),n}function P1(t){let n=t;return n=$(n),n=N(n),n}function R1(t){let n=t;return n=I(n),n=n1(n),n}function H1(t){let n=t;return n=Y(n),n=h(n),n}function q1(t){let n=t;return n=s(n),n=k(n),n}function K1(t){let n=t;return n=d(n),n=Y(n),n=h(n),n}function O1(t){let n=t;return n=s(n),n=k(n),n=S(n),n}function x1(t){let n=t;return n=p(n),n=h(n),n}function C1(t){let n=t;return n=s(n),n=g(n),n}function N1(t){let n=t;/**
 * Convert an array of a98-rgb values in the range 0.0 - 1.0
 * to linear light (un-companded) form. Negative values are also now accepted
 *
 * @license W3C https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document
 * @copyright This software or document includes material copied from or derived from https://github.com/w3c/csswg-drafts/blob/main/css-color-4/conversions.js. Copyright © 2022 W3C® (MIT, ERCIM, Keio, Beihang).
 */var e;return n=[q((e=n)[0]),q(e[1]),q(e[2])],n=l(p1,n),n=h(n),n}function S1(t){let n=t;var e;return n=s(n),n=l(l1,n),n=[G((e=n)[0]),G(e[1]),G(e[2])],n}function I1(t){let n=t;return n=z(n),n=R(n),n=h(n),n}function W1(t){let n=t;return n=s(n),n=y(n),n=T(n),n}function T1(t){let n=t;return n=R(n),n=h(n),n}function j1(t){let n=t;return n=s(n),n=y(n),n}function z1(t){let n=t;var e;return n=[v((e=n)[0]),v(e[1]),v(e[2])],n=l(d1,n),n=h(n),n}function E1(t){let n=t;var e;return n=s(n),n=l(i1,n),n=[D((e=n)[0]),D(e[1]),D(e[2])],n}function F1(t){let n=t;var e;return n=[H((e=n)[0]),H(e[1]),H(e[2])],n=l(M1,n),n}function A1(t){let n=t;var e;return n=l(_1,n),n=[B((e=n)[0]),B(e[1]),B(e[2])],n}function J1(t){let n=t;return n=h(n),n}function Q1(t){let n=t;return n=s(n),n}function U1(t){return t}function E(t){return t[0]>=-1e-4&&t[0]<=1.0001&&t[1]>=-1e-4&&t[1]<=1.0001&&t[2]>=-1e-4&&t[2]<=1.0001}function w(t){return[t[0]<0?0:t[0]>1?1:t[0],t[1]<0?0:t[1]>1?1:t[1],t[2]<0?0:t[2]>1?1:t[2]]}/**
 * @description Calculate deltaE OK which is the simple root sum of squares
 * @param {number[]} reference - Array of OKLab values: L as 0..1, a and b as -1..1
 * @param {number[]} sample - Array of OKLab values: L as 0..1, a and b as -1..1
 * @return {number} How different a color sample is from reference
 *
 * @license W3C https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document
 * @copyright This software or document includes material copied from or derived from https://github.com/w3c/csswg-drafts/blob/main/css-color-4/deltaEOK.js. Copyright © 2022 W3C® (MIT, ERCIM, Keio, Beihang).
 * @see https://github.com/w3c/csswg-drafts/blob/main/css-color-4/deltaEOK.js
 */function F(t,n){const[e,o,r]=t,[u,a,i]=n,c=e-u,_=o-a,f=r-i;return Math.sqrt(c**2+_**2+f**2)}const K=.02,A=1e-4;function V1(t,n,e){const o=t;let r=w(n(o)),u=F(d(e(r)),d(o));if(u<K)return r;let a=0,i=o[1],c=!0;for(;i-a>A;){const _=(a+i)/2;if(o[1]=_,c&&E(n(o)))a=_;else if(r=w(n(o)),u=F(d(e(r)),d(o)),u<K){if(K-u<A)return r;c=!1,a=_}else i=_}return w(n([...o]))}/**
 * @license MIT https://github.com/facelessuser/coloraide/blob/main/LICENSE.md
 */function $1(t,n,e){const o=t[0],r=t[2];let u=n(t);const a=n([o,0,r]);for(let i=0;i<4;i++){if(i>0){const _=e(u);_[0]=o,_[2]=r,u=n(_)}const c=n0(a,u);if(!c)break;u=c}return w(u)}function n0(t,n){let e=1/0,o=-1/0;const r=[0,0,0];for(let u=0;u<3;u++){const a=t[u],i=n[u]-a;r[u]=i;const c=0,_=1;if(i){const f=1/i,O=(c-a)*f,x=(_-a)*f;o=Math.max(Math.min(O,x),o),e=Math.min(Math.max(O,x),e)}else if(a<c||a>_)return!1}return!(o>e||e<0)&&(o<0&&(o=e),!!isFinite(o)&&[t[0]+r[0]*o,t[1]+r[1]*o,t[2]+r[2]*o])}const t0={aliceblue:[240,248,255],antiquewhite:[250,235,215],aqua:[0,255,255],aquamarine:[127,255,212],azure:[240,255,255],beige:[245,245,220],bisque:[255,228,196],black:[0,0,0],blanchedalmond:[255,235,205],blue:[0,0,255],blueviolet:[138,43,226],brown:[165,42,42],burlywood:[222,184,135],cadetblue:[95,158,160],chartreuse:[127,255,0],chocolate:[210,105,30],coral:[255,127,80],cornflowerblue:[100,149,237],cornsilk:[255,248,220],crimson:[220,20,60],cyan:[0,255,255],darkblue:[0,0,139],darkcyan:[0,139,139],darkgoldenrod:[184,134,11],darkgray:[169,169,169],darkgreen:[0,100,0],darkgrey:[169,169,169],darkkhaki:[189,183,107],darkmagenta:[139,0,139],darkolivegreen:[85,107,47],darkorange:[255,140,0],darkorchid:[153,50,204],darkred:[139,0,0],darksalmon:[233,150,122],darkseagreen:[143,188,143],darkslateblue:[72,61,139],darkslategray:[47,79,79],darkslategrey:[47,79,79],darkturquoise:[0,206,209],darkviolet:[148,0,211],deeppink:[255,20,147],deepskyblue:[0,191,255],dimgray:[105,105,105],dimgrey:[105,105,105],dodgerblue:[30,144,255],firebrick:[178,34,34],floralwhite:[255,250,240],forestgreen:[34,139,34],fuchsia:[255,0,255],gainsboro:[220,220,220],ghostwhite:[248,248,255],gold:[255,215,0],goldenrod:[218,165,32],gray:[128,128,128],green:[0,128,0],greenyellow:[173,255,47],grey:[128,128,128],honeydew:[240,255,240],hotpink:[255,105,180],indianred:[205,92,92],indigo:[75,0,130],ivory:[255,255,240],khaki:[240,230,140],lavender:[230,230,250],lavenderblush:[255,240,245],lawngreen:[124,252,0],lemonchiffon:[255,250,205],lightblue:[173,216,230],lightcoral:[240,128,128],lightcyan:[224,255,255],lightgoldenrodyellow:[250,250,210],lightgray:[211,211,211],lightgreen:[144,238,144],lightgrey:[211,211,211],lightpink:[255,182,193],lightsalmon:[255,160,122],lightseagreen:[32,178,170],lightskyblue:[135,206,250],lightslategray:[119,136,153],lightslategrey:[119,136,153],lightsteelblue:[176,196,222],lightyellow:[255,255,224],lime:[0,255,0],limegreen:[50,205,50],linen:[250,240,230],magenta:[255,0,255],maroon:[128,0,0],mediumaquamarine:[102,205,170],mediumblue:[0,0,205],mediumorchid:[186,85,211],mediumpurple:[147,112,219],mediumseagreen:[60,179,113],mediumslateblue:[123,104,238],mediumspringgreen:[0,250,154],mediumturquoise:[72,209,204],mediumvioletred:[199,21,133],midnightblue:[25,25,112],mintcream:[245,255,250],mistyrose:[255,228,225],moccasin:[255,228,181],navajowhite:[255,222,173],navy:[0,0,128],oldlace:[253,245,230],olive:[128,128,0],olivedrab:[107,142,35],orange:[255,165,0],orangered:[255,69,0],orchid:[218,112,214],palegoldenrod:[238,232,170],palegreen:[152,251,152],paleturquoise:[175,238,238],palevioletred:[219,112,147],papayawhip:[255,239,213],peachpuff:[255,218,185],peru:[205,133,63],pink:[255,192,203],plum:[221,160,221],powderblue:[176,224,230],purple:[128,0,128],rebeccapurple:[102,51,153],red:[255,0,0],rosybrown:[188,143,143],royalblue:[65,105,225],saddlebrown:[139,69,19],salmon:[250,128,114],sandybrown:[244,164,96],seagreen:[46,139,87],seashell:[255,245,238],sienna:[160,82,45],silver:[192,192,192],skyblue:[135,206,235],slateblue:[106,90,205],slategray:[112,128,144],slategrey:[112,128,144],snow:[255,250,250],springgreen:[0,255,127],steelblue:[70,130,180],tan:[210,180,140],teal:[0,128,128],thistle:[216,191,216],tomato:[255,99,71],turquoise:[64,224,208],violet:[238,130,238],wheat:[245,222,179],white:[255,255,255],whitesmoke:[245,245,245],yellow:[255,255,0],yellowgreen:[154,205,50]};function J(t){const[n,e,o]=t.map(r=>r<=.03928?r/12.92:Math.pow((r+.055)/1.055,2.4));return .2126*n+.7152*e+.0722*o}function e0(t,n){const e=J(t),o=J(n);return(Math.max(e,o)+.05)/(Math.min(e,o)+.05)}export{y1 as HSL_to_XYZ_D50,L1 as HWB_to_XYZ_D50,P1 as LCH_to_XYZ_D50,G1 as Lab_to_XYZ_D50,d as OKLCH_to_OKLab,K1 as OKLCH_to_XYZ_D50,S as OKLab_to_OKLCH,Y as OKLab_to_XYZ,H1 as OKLab_to_XYZ_D50,I1 as P3_to_XYZ_D50,F1 as ProPhoto_RGB_to_XYZ_D50,D1 as XYZ_D50_to_HSL,B1 as XYZ_D50_to_HWB,R1 as XYZ_D50_to_LCH,v1 as XYZ_D50_to_Lab,O1 as XYZ_D50_to_OKLCH,q1 as XYZ_D50_to_OKLab,W1 as XYZ_D50_to_P3,A1 as XYZ_D50_to_ProPhoto,U1 as XYZ_D50_to_XYZ_D50,Q1 as XYZ_D50_to_XYZ_D65,S1 as XYZ_D50_to_a98_RGB,j1 as XYZ_D50_to_lin_P3,C1 as XYZ_D50_to_lin_sRGB,E1 as XYZ_D50_to_rec_2020,k1 as XYZ_D50_to_sRGB,J1 as XYZ_D65_to_XYZ_D50,k as XYZ_to_OKLab,y as XYZ_to_lin_P3,g as XYZ_to_lin_sRGB,N1 as a98_RGB_to_XYZ_D50,w as clip,e0 as contrast_ratio_wcag_2_1,T as gam_P3,b as gam_sRGB,E as inGamut,z as lin_P3,R as lin_P3_to_XYZ,T1 as lin_P3_to_XYZ_D50,M as lin_sRGB,p as lin_sRGB_to_XYZ,x1 as lin_sRGB_to_XYZ_D50,V1 as mapGamut,$1 as mapGamutRayTrace,t0 as namedColors,z1 as rec_2020_to_XYZ_D50,Z1 as sRGB_to_XYZ_D50};
