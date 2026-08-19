const fs = require('fs');
const path = require('path');

const circuitsJsonPath = path.join(__dirname, '..', 'circuits.json');

const TARGET_WIDTH = 600;
const TARGET_HEIGHT = 600;

if (!fs.existsSync(circuitsJsonPath)) {
    console.error(`Error: circuits.json not found at ${circuitsJsonPath}`);
    process.exit(1);
}

const arg = process.argv[2] ? process.argv[2].toLowerCase() : null;
let targetTypes = [];

if (!arg) {
    targetTypes = ['minimal', 'detailed'];
} else if (arg === 'minimal' || arg === 'detailed') {
    targetTypes = [arg];
} else {
    console.error(`Error: Unknown argument "${arg}". Expected "minimal", "detailed", or no argument.`);
    process.exit(1);
}

const circuitsData = JSON.parse(fs.readFileSync(circuitsJsonPath, 'utf8'));

// extract layouts with f1-orientation
const orientationMap = new Map();
for (const circuit of circuitsData) {
    if (Array.isArray(circuit.layouts)) {
        for (const layout of circuit.layouts) {
            if (layout.layoutId && typeof layout['f1-orientation'] === 'number') {
                orientationMap.set(layout.layoutId, layout['f1-orientation']);
            }
        }
    }
}

console.log(`
_______________   _____________                    __________            __________    __________
___  ____/_<  /   __  ____/__(_)________________  ____(_)_  /________    __  ___/_ |  / /_  ____/
__  /_   __  /    _  /    __  /__  ___/  ___/  / / /_  /_  __/_  ___/    _____ \\__ | / /_  / __
_  __/   _  /     / /___  _  / _  /   / /__ / /_/ /_  / / /_ _(__  )     ____/ /__ |/ / / /_/ /
/_/      /_/      \\____/  /_/  /_/    \\___/ \\__,_/ /_/  \\__/ /____/      /____/ _____/  \\____/
`);
console.log(`Found ${orientationMap.size} layout(s) with 'f1-orientation' configured.`);

/**
 * Samples points along SVG path data and rotates them around (0, 0) by angleDeg.
 */
function getRotatedPathPoints(d, angleDeg, sampleSteps = 20) {
    const rad = (angleDeg * Math.PI) / 180;
    const cos = Math.cos(rad);
    const sin = Math.sin(rad);

    function rotatePt(x, y) {
        return {
            x: x * cos - y * sin,
            y: x * sin + y * cos
        };
    }

    const tokens = [];
    const regex = /([a-df-z])|([-+]?(?:\d*\.\d+|\d+)(?:[eE][-+]?\d+)?)/gi;
    let match;
    while ((match = regex.exec(d)) !== null) {
        if (match[1]) {
            tokens.push(match[1]);
        } else {
            tokens.push(parseFloat(match[2]));
        }
    }

    let curX = 0, curY = 0, startX = 0, startY = 0, lastControlX = 0, lastControlY = 0, lastCmd = '';
    const rotatedPoints = [];

    function addRotatedPoint(x, y) {
        rotatedPoints.push(rotatePt(x, y));
    }

    let i = 0;
    while (i < tokens.length) {
        let token = tokens[i];
        if (typeof token === 'string') {
            let cmd = token;
            i++;

            while (i < tokens.length && typeof tokens[i] === 'number') {
                if (cmd === 'M' || cmd === 'm') {
                    const isRel = cmd === 'm';
                    const x = isRel ? curX + tokens[i] : tokens[i];
                    const y = isRel ? curY + tokens[i + 1] : tokens[i + 1];
                    i += 2;
                    curX = x; curY = y; startX = x; startY = y;
                    addRotatedPoint(curX, curY);
                    cmd = isRel ? 'l' : 'L';
                } else if (cmd === 'L' || cmd === 'l') {
                    const isRel = cmd === 'l';
                    curX = isRel ? curX + tokens[i] : tokens[i];
                    curY = isRel ? curY + tokens[i + 1] : tokens[i + 1];
                    i += 2;
                    addRotatedPoint(curX, curY);
                } else if (cmd === 'H' || cmd === 'h') {
                    const isRel = cmd === 'h';
                    curX = isRel ? curX + tokens[i] : tokens[i];
                    i += 1;
                    addRotatedPoint(curX, curY);
                } else if (cmd === 'V' || cmd === 'v') {
                    const isRel = cmd === 'v';
                    curY = isRel ? curY + tokens[i] : tokens[i];
                    i += 1;
                    addRotatedPoint(curX, curY);
                } else if (cmd === 'C' || cmd === 'c') {
                    const isRel = cmd === 'c';
                    const x1 = isRel ? curX + tokens[i] : tokens[i];
                    const y1 = isRel ? curY + tokens[i + 1] : tokens[i + 1];
                    const x2 = isRel ? curX + tokens[i + 2] : tokens[i + 2];
                    const y2 = isRel ? curY + tokens[i + 3] : tokens[i + 3];
                    const x = isRel ? curX + tokens[i + 4] : tokens[i + 4];
                    const y = isRel ? curY + tokens[i + 5] : tokens[i + 5];
                    i += 6;

                    const p0 = { x: curX, y: curY };
                    const p1 = { x: x1, y: y1 };
                    const p2 = { x: x2, y: y2 };
                    const p3 = { x: x, y: y };

                    for (let s = 0; s <= sampleSteps; s++) {
                        const t = s / sampleSteps;
                        const it = 1 - t;
                        const bx = it * it * it * p0.x + 3 * it * it * t * p1.x + 3 * it * t * t * p2.x + t * t * t * p3.x;
                        const by = it * it * it * p0.y + 3 * it * it * t * p1.y + 3 * it * t * t * p2.y + t * t * t * p3.y;
                        addRotatedPoint(bx, by);
                    }

                    lastControlX = x2; lastControlY = y2;
                    curX = x; curY = y;
                } else if (cmd === 'S' || cmd === 's') {
                    const isRel = cmd === 's';
                    let x1 = curX, y1 = curY;
                    if (lastCmd === 'C' || lastCmd === 'c' || lastCmd === 'S' || lastCmd === 's') {
                        x1 = 2 * curX - lastControlX;
                        y1 = 2 * curY - lastControlY;
                    }
                    const x2 = isRel ? curX + tokens[i] : tokens[i];
                    const y2 = isRel ? curY + tokens[i + 1] : tokens[i + 1];
                    const x = isRel ? curX + tokens[i + 2] : tokens[i + 2];
                    const y = isRel ? curY + tokens[i + 3] : tokens[i + 3];
                    i += 4;

                    const p0 = { x: curX, y: curY };
                    const p1 = { x: x1, y: y1 };
                    const p2 = { x: x2, y: y2 };
                    const p3 = { x: x, y: y };

                    for (let s = 0; s <= sampleSteps; s++) {
                        const t = s / sampleSteps;
                        const it = 1 - t;
                        const bx = it * it * it * p0.x + 3 * it * it * t * p1.x + 3 * it * t * t * p2.x + t * t * t * p3.x;
                        const by = it * it * it * p0.y + 3 * it * it * t * p1.y + 3 * it * t * t * p2.y + t * t * t * p3.y;
                        addRotatedPoint(bx, by);
                    }

                    lastControlX = x2; lastControlY = y2;
                    curX = x; curY = y;
                } else if (cmd === 'Q' || cmd === 'q') {
                    const isRel = cmd === 'q';
                    const x1 = isRel ? curX + tokens[i] : tokens[i];
                    const y1 = isRel ? curY + tokens[i + 1] : tokens[i + 1];
                    const x = isRel ? curX + tokens[i + 2] : tokens[i + 2];
                    const y = isRel ? curY + tokens[i + 3] : tokens[i + 3];
                    i += 4;

                    const p0 = { x: curX, y: curY };
                    const p1 = { x: x1, y: y1 };
                    const p2 = { x: x };
                    const p2y = y;

                    for (let s = 0; s <= sampleSteps; s++) {
                        const t = s / sampleSteps;
                        const it = 1 - t;
                        const bx = it * it * p0.x + 2 * it * t * p1.x + t * t * x;
                        const by = it * it * p0.y + 2 * it * t * p1.y + t * t * y;
                        addRotatedPoint(bx, by);
                    }

                    lastControlX = x1; lastControlY = y1;
                    curX = x; curY = y;
                } else if (cmd === 'T' || cmd === 't') {
                    const isRel = cmd === 't';
                    let x1 = curX, y1 = curY;
                    if (lastCmd === 'Q' || lastCmd === 'q' || lastCmd === 'T' || lastCmd === 't') {
                        x1 = 2 * curX - lastControlX;
                        y1 = 2 * curY - lastControlY;
                    }
                    const x = isRel ? curX + tokens[i] : tokens[i];
                    const y = isRel ? curY + tokens[i + 1] : tokens[i + 1];
                    i += 2;

                    const p0 = { x: curX, y: curY };
                    const p1 = { x: x1, y: y1 };

                    for (let s = 0; s <= sampleSteps; s++) {
                        const t = s / sampleSteps;
                        const it = 1 - t;
                        const bx = it * it * p0.x + 2 * it * t * p1.x + t * t * x;
                        const by = it * it * p0.y + 2 * it * t * p1.y + t * t * y;
                        addRotatedPoint(bx, by);
                    }

                    lastControlX = x1; lastControlY = y1;
                    curX = x; curY = y;
                } else if (cmd === 'A' || cmd === 'a') {
                    const isRel = cmd === 'a';
                    const endX = isRel ? curX + tokens[i + 5] : tokens[i + 5];
                    const endY = isRel ? curY + tokens[i + 6] : tokens[i + 6];
                    i += 7;
                    addRotatedPoint(endX, endY);
                    curX = endX; curY = endY;
                } else if (cmd === 'Z' || cmd === 'z') {
                    curX = startX; curY = startY;
                    addRotatedPoint(curX, curY);
                    break;
                } else {
                    i++;
                }
                lastCmd = cmd;
            }
        } else {
            i++;
        }
    }

    return rotatedPoints;
}

/**
 * Calculates the bounding box center of the rotated path.
 */
function getRotatedPathCenter(svgContent, angleDeg) {
    const pathMatch = svgContent.match(/<path[^>]*\bd=["']([^"']+)["']/i);
    if (!pathMatch) {
        return null;
    }

    const rotatedPoints = getRotatedPathPoints(pathMatch[1], angleDeg);
    if (rotatedPoints.length === 0) {
        return null;
    }

    let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
    for (const pt of rotatedPoints) {
        if (pt.x < minX) minX = pt.x;
        if (pt.x > maxX) maxX = pt.x;
        if (pt.y < minY) minY = pt.y;
        if (pt.y > maxY) maxY = pt.y;
    }

    return {
        cx: (minX + maxX) / 2,
        cy: (minY + maxY) / 2
    };
}

/**
 * Rotates the SVG by a given angle around the target center.
 */
function rotateSvg(svgContent, angle, targetWidth = TARGET_WIDTH, targetHeight = TARGET_HEIGHT) {
    const svgTagMatch = svgContent.match(/<svg[^>]*>/i);
    if (!svgTagMatch) {
        throw new Error('Invalid SVG: No <svg> tag found');
    }
    let svgOpenTag = svgTagMatch[0];
    const afterSvgOpenIndex = svgTagMatch.index + svgOpenTag.length;
    const svgCloseIndex = svgContent.lastIndexOf('</svg>');
    if (svgCloseIndex === -1) {
        throw new Error('Invalid SVG: No </svg> closing tag found');
    }

    // update width and height in the <svg> opening tag to target size (600x600)
    if (/\bwidth=["'][^"']+["']/i.test(svgOpenTag)) {
        svgOpenTag = svgOpenTag.replace(/\bwidth=["'][^"']+["']/i, `width="${targetWidth}"`);
    } else {
        svgOpenTag = svgOpenTag.replace(/<svg\b/i, `<svg width="${targetWidth}"`);
    }

    if (/\bheight=["'][^"']+["']/i.test(svgOpenTag)) {
        svgOpenTag = svgOpenTag.replace(/\bheight=["'][^"']+["']/i, `height="${targetHeight}"`);
    } else {
        svgOpenTag = svgOpenTag.replace(/<svg\b/i, `<svg height="${targetHeight}"`);
    }

    if (/\bviewBox=["'][^"']+["']/i.test(svgOpenTag)) {
        svgOpenTag = svgOpenTag.replace(/\bviewBox=["'][^"']+["']/i, `viewBox="0 0 ${targetWidth} ${targetHeight}"`);
    }

    let innerContent = svgContent.slice(afterSvgOpenIndex, svgCloseIndex);

    // keep desc block outside the transform group if present
    const descMatch = innerContent.match(/([\s]*<desc>[\s\S]*?<\/desc>[\s]*)/i);
    let descBlock = '';
    if (descMatch) {
        descBlock = descMatch[1].trim();
        innerContent = innerContent.replace(descMatch[0], '');
    }

    const trimmedInner = innerContent.trim();
    if (!trimmedInner) {
        return svgContent;
    }

    const indentedContent = trimmedInner
        .split('\n')
        .map(line => (line.trim().length > 0 ? '        ' + line.trim() : ''))
        .join('\n');

    const descFormatted = descBlock ? `    ${descBlock.split('\n').map(l => l.trim()).join('\n    ')}\n` : '';

    // calculate exact center of the rotated path bounding box to ensure perfect centering
    const rotatedCenter = getRotatedPathCenter(svgContent, angle);
    let transformAttr;

    if (rotatedCenter) {
        const dx = +(targetWidth / 2 - rotatedCenter.cx).toFixed(3);
        const dy = +(targetHeight / 2 - rotatedCenter.cy).toFixed(3);
        transformAttr = `translate(${dx} ${dy}) rotate(${angle})`;
    } else {
        const dx = (targetWidth - 500) / 2;
        const dy = (targetHeight - 500) / 2;
        transformAttr = `translate(${dx} ${dy}) rotate(${angle} 250 250)`;
    }

    return `${svgOpenTag}\n${descFormatted}    <g transform="${transformAttr}">\n${indentedContent}\n    </g>\n</svg>\n`;
}

let totalGeneratedCount = 0;

for (const targetType of targetTypes) {
    const srcBaseDir = path.join(__dirname, '..', 'circuits', targetType);
    const outBaseDir = path.join(__dirname, '..', 'circuits', 'f1-orientation', targetType);

    if (!fs.existsSync(srcBaseDir)) {
        console.warn(`Warning: Source directory not found at ${srcBaseDir}, skipping.`);
        continue;
    }

    // find style subdirectories (e.g. black, black-outline, white, white-outline)
    const styles = fs.readdirSync(srcBaseDir, { withFileTypes: true })
        .filter(entry => entry.isDirectory())
        .map(entry => entry.name);

    let typeCount = 0;

    for (const style of styles) {
        const styleSrcDir = path.join(srcBaseDir, style);
        const styleOutDir = path.join(outBaseDir, style);

        for (const [layoutId, angle] of orientationMap.entries()) {
            const svgFileName = `${layoutId}.svg`;
            const srcFilePath = path.join(styleSrcDir, svgFileName);

            if (fs.existsSync(srcFilePath)) {
                if (!fs.existsSync(styleOutDir)) {
                    fs.mkdirSync(styleOutDir, { recursive: true });
                }

                const rawSvg = fs.readFileSync(srcFilePath, 'utf8');
                const rotatedSvg = rotateSvg(rawSvg, angle, TARGET_WIDTH, TARGET_HEIGHT);
                const outFilePath = path.join(styleOutDir, svgFileName);

                fs.writeFileSync(outFilePath, rotatedSvg, 'utf8');
                console.log(`Generated: ${path.relative(path.join(__dirname, '..'), outFilePath)} (${angle}°, ${TARGET_WIDTH}x${TARGET_HEIGHT})`);
                typeCount++;
            }
        }
    }

    console.log(`\nGenerated ${typeCount} file(s) for "${targetType}" in circuits/f1-orientation/${targetType}.`);
    totalGeneratedCount += typeCount;
}

console.log(`\nDone! Successfully generated ${totalGeneratedCount} SVG file(s) in total.`);
