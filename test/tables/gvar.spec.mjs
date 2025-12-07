import assert from 'assert';
import { parse } from '../../src/opentype.mjs';
import { readFileSync, existsSync } from 'fs';
const loadSync = (url, opt) => parse(readFileSync(url), opt);

describe('tables/gvar.mjs', function() {
    const fonts = {
        gvarTest1: loadSync('./test/fonts/TestGVAROne.ttf'),
        gvarTest2: loadSync('./test/fonts/TestGVARTwo.ttf'),
        gvarTest3: loadSync('./test/fonts/TestGVARThree.ttf'),
        gvarTest4: loadSync('./test/fonts/TestGVARFour.ttf'),
        // Licensing for TestGVAREight and TestGVARNine is not clear,
        // so we can't include them
        // gvarTest8: loadSync('./test/fonts/TestGVAREight.ttf'),
        // gvarTest9: loadSync('./test/fonts/TestGVARNine.ttf'),
        gvarTestComp: loadSync('./test/fonts/TestGVAR-Composite-0.ttf'),
        gvarTestCompMissing: loadSync('./test/fonts/TestGVAR-Composite-Missing.ttf'),
        gvarTestCvar1: loadSync('./test/fonts/TestCVARGVAROne.ttf'),
        gvarTestCvar2: loadSync('./test/fonts/TestCVARGVARTwo.ttf'),
    };

    // Load Kario font for composite variation tests if available
    const karioPath = './test/fonts/Kario39C3VarWEB-Roman.woff';
    const karioFont = existsSync(karioPath) ? loadSync(karioPath) : null;
    it('correctly parses the glyph variations table', function() {
        // tests for all fonts
        for(const fontName in fonts) {
            const font = fonts[fontName];
            assert.deepEqual(font.tables.gvar.version, [1,0]);
            assert.equal(font.tables.gvar.sharedTuples.find(t => t.length !== font.tables.fvar.axes.length), undefined);
            assert.deepEqual(Object.keys(font.tables.gvar.glyphVariations), Object.keys(font.glyphs.glyphs));
        };
        
        [1,2,3].forEach(n => {
            const font = fonts[`gvarTest${n}`];
            assert.deepEqual(font.tables.gvar.sharedTuples, [[-1],[1]]);
            assert.deepEqual(font.tables.gvar.glyphVariations[0].headers[0].deltas,
                [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
                    0,0,0,0,1,1,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,
                    0,0,0,0,0,0,0,0,0,0,0,0,0]);
            assert.deepEqual(font.tables.gvar.glyphVariations[0].headers[0].deltasY,
                [-1,0,0,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,0,0,-1,-1,0,0,-1,-1,0,0,0,
                    0,0,0,0,0,0,0,0,0,-1,-1,0,0,0,0,0,0,0,0,0,0,0,0,-1,-1,0,0,0,0,
                    0,0,0,0,0,0,0,0,-1,-1,0,0,-1,-1,-1,-1,-1,-1,0,0,0,0,0]);
            assert.deepEqual(font.tables.gvar.glyphVariations[0].headers[1].deltas,
                [-2,-2,-10,-10,-4,-8,-8,-4,-5,-5,-7,-7,-4,-8,-8,-5,-5,-6,-6,-7,-7,
                    -5,-5,-4,-4,-8,-8,-7,-7,-4,-4,-6,-6,-8,-8,-4,-4,-5,-5,-4,-5,
                    -5,-5,-5,-4,-8,-8,-6,-6,-4,-4,-8,-8,-6,-6,-8,-8,-4,-4,-5,-5,
                    -4,-4,-8,-8,-5,-7,-8,-8,-4,-4,-6,-4,0,-12,0,0]);
            assert.deepEqual(font.tables.gvar.glyphVariations[0].headers[1].deltasY,
                [23,0,0,23,18,18,16,16,17,17,17,17,14,14,12,12,13,13,13,13,13,13,12,
                    12,11,11,9,9,10,10,10,10,8,8,7,7,8,8,9,9,6,5,5,6,7,7,6,6,4,4,4,
                    4,3,3,2,2,2,2,2,2,3,3,21,21,21,21,19,19,18,18,19,19,21,0,0,0,0]);

            assert.deepEqual(font.tables.gvar.glyphVariations[13].headers[0].deltas,
                [0,12,0,15,15,4,4,15,15,-12,-12,-7,-7,-12,-12,-12,-12,-4,13,-12,-12,
                    15,15,24,-12,0,23,23,26,8,-8,3,0,-3,12,0,-3,-12,12,25,11,-8,-7,
                    -12,-23,-23,-23,-23,-9,-20,-4,4,-4,-1,-8,16,19,20,0,-2,0,1,8,16,
                    17,12,11,-13,-13,13,13,7,7,-20,-20,8,8,-16,-16,0,-14,-19,-20,-24,
                    -4,-5,-4,-23,-22,-28,-24,-4,-13,-13,13,13,16,16,-8,-8,20,20,-8,
                    -8,-13,-13,13,13,8,8,-16,-16,16,16,-8,-8,0,0,0,0]);
            assert.deepEqual(font.tables.gvar.glyphVariations[13].headers[0].deltasY,
                [0,-23,-32,4,8,8,-27,-27,-8,-8,-27,-27,8,8,-4,-13,-24,4,1,35,-12,-12,
                    35,19,-12,-47,-26,-8,-6,8,-16,-26,-27,-36,20,20,-5,0,-31,-15,-3,
                    0,-6,-16,-16,20,-8,-12,-27,-24,4,3,16,0,-12,-19,-32,-4,0,-10,-4,
                    -3,-12,8,9,20,4,-8,-43,-43,-8,-12,-28,-28,-12,-35,-2,-2,-35,-12,
                    6,8,5,4,-7,-8,-8,-4,-3,-12,-14,-32,-3,-39,-39,-3,-35,-2,-2,-35,
                    -12,-28,-28,-12,8,-28,-28,8,-18,-8,-8,-18,-18,-8,-8,-18,0,0,0,0]);
            assert.deepEqual(font.tables.gvar.glyphVariations[13].headers[1].deltas,
                [16,8,-14,-20,-20,0,0,-20,-20,20,20,4,4,20,20,11,-4,0,21,20,20,-20,
                    -20,-8,19,0,-6,-16,-6,0,28,16,4,-19,-31,16,29,27,4,-4,-15,24,30,
                    35,0,0,26,39,13,-4,-28,-5,8,8,27,8,-2,-15,16,12,20,7,11,9,10,12,
                    17,35,35,-35,-35,-12,-12,35,35,0,0,15,15,-16,-7,0,0,11,-4,-10,
                    -20,4,7,11,6,0,35,35,-35,-35,-16,-16,-1,-1,-35,-35,12,12,35,35,
                    -35,-35,-35,-35,15,15,-16,-16,34,34,0,0,0,0]);
            assert.deepEqual(font.tables.gvar.glyphVariations[13].headers[1].deltasY,
                [-35,16,11,5,-31,-31,12,12,0,0,12,12,-31,-31,-16,-4,11,-35,-50,-47,
                    -27,-27,-43,-37,-23,0,1,-19,-21,-23,0,7,12,-24,-42,-42,-10,-11,
                    12,14,-15,-20,-12,0,0,-42,-28,-19,-7,4,-31,-42,-47,-37,-23,-16,
                    -12,-23,-24,-39,-24,-7,-5,-32,-42,-47,-40,-35,28,28,-35,-19,35,
                    35,-19,-8,-1,-1,-8,-24,-32,-43,-43,-19,-22,-7,-23,-24,-21,-16,
                    -7,0,-43,23,23,-43,-8,-1,-1,-8,-19,35,35,-19,-31,35,35,-31,5,0,
                    0,5,5,0,0,5,0,0,0,0]);
        });
        
        [1,3].forEach(n => {
            const font = fonts[`gvarTest${n}`];
            assert.deepEqual(font.tables.gvar.glyphVariations[0].sharedPoints, []);
        });
        
        [2].forEach(n => {
            const font = fonts[`gvarTest${n}`];
            assert.deepEqual(font.tables.gvar.glyphVariations[0].sharedPoints, [
                0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
                21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40,
                41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60,
                61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76
            ]);
        });

        [4].forEach(n => {
            const font = fonts[`gvarTest${n}`];
            assert.deepEqual(font.tables.gvar.sharedTuples, [
                [ 1, -0.63201904296875 ], [ 1, -1 ], [ 1, 0 ], [ 0, -0.63201904296875 ], [ 0,-1 ]
            ]);
        });
        
        ['Comp','CompMissing'].forEach(n => {
            const font = fonts[`gvarTest${n}`];
            assert.deepEqual(font.tables.gvar.sharedTuples, [[-1]]);
        });
    });

    it('correctly transforms TrueType glyphs', function() {
        ['Cvar1','Cvar2'].forEach(n => {
            const font = fonts[`gvarTest${n}`];
            const untransformedPoints = [
                287,-10,179,-10,55,128,55,269,55,409,174,546,290,546,398,546,522,409,522,269,522,128,
                402,-10,289,42,339,42,399,93,425,194,425,269,425,344,398,443,338,493,288,493,238,493,
                178,443,152,344,152,269,152,194,179,93,239,42
            ];
            const transformedPoints = [];
            assert.deepEqual(font.glyphs.get(4).points.map(p => [p.x, p.y]).flat(), untransformedPoints);
        });
    });

    it('correctly transforms composite glyphs', function() {
        ['Comp'/*,'CompMissing'*/].forEach(n => {
            const font = fonts[`gvarTest${n}`];
            const untransformedPathData =
                'M171 500Q135 500 106.50 483.50Q78 467 62 438.50Q46 410 46 373L46 257' +
                'Q46 220 62 191.50Q78 163 106.50 146.50Q135 130 171 130Q208 130 236 146.50' +
                'Q264 163 280 191.50Q296 220 296 257L296 373Q296 410 280 438.50' +
                'Q264 467 236 483.50Q208 500 171 500ZM171 450Q205 450 225.50 429' +
                'Q246 408 246 373L246 257Q246 222 225.50 201Q205 180 171 180Q' +
                '137 180 116.50 201Q96 222 96 257L96 373Q96 408 116.50 429Q137 450 171 450Z' +
                'M246 65Q236 65 228.50 57.50Q221 50 221 40L221 15Q221 4 228.50-3' +
                'Q236-10 246-10Q257-10 264-3Q271 4 271 15L271 40Q271 50 264 57.50' +
                'Q257 65 246 65ZM96 65Q86 65 78.50 57.50Q71 50 71 40L71 15Q71 4 78.50-3' +
                'Q86-10 96-10Q107-10 114-3Q121 4 121 15L121 40Q121 50 114 57.50Q107 65 96 65Z'
            assert.equal(font.glyphs.get(6).toPathData(), untransformedPathData);
            assert.equal(font.glyphs.get(6).toPathData({}, font), untransformedPathData);
            
            const transformedPathData =
                'M146 500Q109 500 82 483Q55 466 43.50 436Q32 406 38 369L57 253' +
                'Q63 216 83 188.50Q103 161 132.50 145.50Q162 130 197 130Q235 130 261.50 147' +
                'Q288 164 300 193.50Q312 223 306 261L286 377Q280 413 260.50 441Q' +
                '241 469 211.50 484.50Q182 500 146 500ZM146 450Q181 450 206.50 428' +
                'Q232 406 238 369L257 253Q262 219 246 199.50Q230 180 197 180Q162 180 137 202' +
                'Q112 224 106 261L86 377Q81 411 97 430.50Q113 450 146 450ZM291 65' +
                'Q280 65 272.50 56Q265 47 267 36L270 12Q271 2 278-4Q285-10 295-10' +
                'Q306-10 313.50-1Q321 8 319 19L315 43Q314 52 307.50 58.50Q301 65 291 65Z' +
                'M141 65Q130 65 122.50 56Q115 47 117 36L120 12Q121 2 128-4Q135-10 145-10' +
                'Q156-10 163.50-1Q171 8 169 19L165 43Q164 52 157.50 58.50Q151 65 141 65Z';
            assert.equal(font.glyphs.get(6).toPathData({variation: {slnt: -9}}, font), transformedPathData);
            font.variation.set({slnt: -9});
            assert.equal(font.glyphs.get(6).toPathData({}, font), transformedPathData);
        });
    });

    it('maintains tittle alignment for composite glyphs across width variations', function() {
        if (!karioFont) {
            this.skip();
            return;
        }

        // Helper to get stem top center (upper 30% of glyph)
        function getStemTopCenter(points) {
            const ys = points.map(p => p.y);
            const maxY = Math.max(...ys);
            const threshold = maxY * 0.7;
            const topPoints = points.filter(p => p.y >= threshold);
            if (topPoints.length === 0) return null;
            const topXs = topPoints.map(p => p.x);
            return (Math.min(...topXs) + Math.max(...topXs)) / 2;
        }

        // Test 'i' and 'j' glyphs
        for (const char of ['i', 'j']) {
            const glyph = karioFont.charToGlyph(char);
            glyph.getPath(); // Force load components

            const baseGlyph = karioFont.glyphs.get(glyph.components[0].glyphIndex);
            const numBasePoints = baseGlyph.points.length;

            // Get default tittle offset
            karioFont.variation.set({wdth: 100});
            const defaultTransformed = karioFont.variation.getTransform(glyph, {wdth: 100});
            const defaultXs = defaultTransformed.points.map(p => p.x);
            const defaultStemTop = getStemTopCenter(defaultTransformed.points.slice(0, numBasePoints));
            const defaultTittleXs = defaultXs.slice(numBasePoints);
            const defaultTittleCenter = (Math.min(...defaultTittleXs) + Math.max(...defaultTittleXs)) / 2;
            const defaultOffset = defaultTittleCenter - defaultStemTop;

            // Test at different widths - tittle offset should remain consistent
            for (const wdth of [46, 123]) {
                karioFont.variation.set({wdth});
                const transformed = karioFont.variation.getTransform(glyph, {wdth});
                const xs = transformed.points.map(p => p.x);
                const stemTop = getStemTopCenter(transformed.points.slice(0, numBasePoints));
                const tittleXs = xs.slice(numBasePoints);
                const tittleCenter = (Math.min(...tittleXs) + Math.max(...tittleXs)) / 2;
                const offset = tittleCenter - stemTop;

                // Tittle offset should stay within 2 units of default
                assert.ok(
                    Math.abs(offset - defaultOffset) < 2,
                    `${char} tittle offset at wdth=${wdth} (${offset.toFixed(1)}) differs from default (${defaultOffset.toFixed(1)})`
                );
            }
        }
    });

    it('varies advance width for composite glyphs with width axis', function() {
        if (!karioFont) {
            this.skip();
            return;
        }

        for (const char of ['i', 'j']) {
            const glyph = karioFont.charToGlyph(char);
            glyph.getPath();

            // Get advance widths at different wdth values
            const advanceWidths = {};
            for (const wdth of [46, 100, 123]) {
                karioFont.variation.set({wdth});
                const transformed = karioFont.variation.getTransform(glyph, {wdth});
                advanceWidths[wdth] = transformed.advanceWidth;
            }

            // Advance width should increase with wdth axis
            assert.ok(
                advanceWidths[46] < advanceWidths[100],
                `${char} advanceWidth at wdth=46 (${advanceWidths[46]}) should be less than at wdth=100 (${advanceWidths[100]})`
            );
            assert.ok(
                advanceWidths[100] < advanceWidths[123],
                `${char} advanceWidth at wdth=100 (${advanceWidths[100]}) should be less than at wdth=123 (${advanceWidths[123]})`
            );
        }
    });

    it('handles rotated/mirrored composite glyphs (like u from n) across width variations', function() {
        if (!karioFont) {
            this.skip();
            return;
        }

        // "u" in Kario is "n" rotated 180° (xScale=-1, yScale=-1)
        // The dx offset must scale with width variation to position correctly
        const uGlyph = karioFont.charToGlyph('u');
        uGlyph.getPath();

        // Verify it's a composite with a transform
        assert.equal(uGlyph.numberOfContours, -1, 'u should be composite');
        assert.equal(uGlyph.components[0].xScale, -1, 'u should use xScale=-1 (mirrored)');

        // Test advance widths at different wdth values
        for (const wdth of [46, 100, 123]) {
            karioFont.variation.set({wdth});
            const transformed = karioFont.variation.getTransform(uGlyph, {wdth});

            // Get outline bounds
            const xs = transformed.points.map(p => p.x);
            const minX = Math.min(...xs);
            const maxX = Math.max(...xs);

            // The outline should fit within the advance width with reasonable sidebearings
            // At wdth=46: advanceWidth should be ~240, not 606
            // At wdth=123: advanceWidth should be ~760
            assert.ok(
                minX >= 0 && minX < 50,
                `u at wdth=${wdth}: leftSideBearing (${minX.toFixed(0)}) should be small positive`
            );
            assert.ok(
                maxX < transformed.advanceWidth + 10,
                `u at wdth=${wdth}: outline maxX (${maxX.toFixed(0)}) should fit in advanceWidth (${transformed.advanceWidth.toFixed(0)})`
            );
        }

        // Verify advance width varies with wdth axis
        karioFont.variation.set({wdth: 46});
        const narrow = karioFont.variation.getTransform(uGlyph, {wdth: 46});
        karioFont.variation.set({wdth: 123});
        const wide = karioFont.variation.getTransform(uGlyph, {wdth: 123});

        assert.ok(
            narrow.advanceWidth < 300,
            `u at wdth=46 should have narrow advanceWidth (${narrow.advanceWidth.toFixed(0)}), not default`
        );
        assert.ok(
            wide.advanceWidth > 700,
            `u at wdth=123 should have wide advanceWidth (${wide.advanceWidth.toFixed(0)})`
        );

        // Verify baseline alignment stays consistent across widths
        // The minY (baseline position) should be approximately the same at all widths
        karioFont.variation.set({wdth: 100});
        const defaultTransform = karioFont.variation.getTransform(uGlyph, {wdth: 100});
        const defaultMinY = Math.min(...defaultTransform.points.map(p => p.y));

        for (const wdth of [46, 123]) {
            karioFont.variation.set({wdth});
            const transformed = karioFont.variation.getTransform(uGlyph, {wdth});
            const minY = Math.min(...transformed.points.map(p => p.y));
            assert.ok(
                Math.abs(minY - defaultMinY) < 2,
                `u baseline at wdth=${wdth} (minY=${minY.toFixed(0)}) should match default (${defaultMinY.toFixed(0)})`
            );
        }
    });

    it('maintains diacritic alignment for umlauts across width variations', function() {
        if (!karioFont) {
            this.skip();
            return;
        }

        // Helper to get stem top center (upper 30% of glyph)
        function getStemTopCenter(points) {
            const ys = points.map(p => p.y);
            const maxY = Math.max(...ys);
            const threshold = maxY * 0.7;
            const topPoints = points.filter(p => p.y >= threshold);
            if (topPoints.length === 0) {
                const xs = points.map(p => p.x);
                return (Math.min(...xs) + Math.max(...xs)) / 2;
            }
            const topXs = topPoints.map(p => p.x);
            return (Math.min(...topXs) + Math.max(...topXs)) / 2;
        }

        // Test umlaut glyphs
        for (const char of ['ä', 'ö', 'ü']) {
            const glyph = karioFont.charToGlyph(char);
            glyph.getPath();

            const baseGlyph = karioFont.glyphs.get(glyph.components[0].glyphIndex);
            const numBasePoints = baseGlyph.points.length;

            // Get default diacritic offset
            karioFont.variation.set({wdth: 100});
            const defaultTransformed = karioFont.variation.getTransform(glyph, {wdth: 100});
            const defaultStemTop = getStemTopCenter(defaultTransformed.points.slice(0, numBasePoints));
            const defaultDiacriticXs = defaultTransformed.points.slice(numBasePoints).map(p => p.x);
            const defaultDiacriticCenter = (Math.min(...defaultDiacriticXs) + Math.max(...defaultDiacriticXs)) / 2;
            const defaultOffset = defaultDiacriticCenter - defaultStemTop;

            // Test at different widths - diacritic offset should remain consistent
            for (const wdth of [46, 123]) {
                karioFont.variation.set({wdth});
                const transformed = karioFont.variation.getTransform(glyph, {wdth});
                const stemTop = getStemTopCenter(transformed.points.slice(0, numBasePoints));
                const diacriticXs = transformed.points.slice(numBasePoints).map(p => p.x);
                const diacriticCenter = (Math.min(...diacriticXs) + Math.max(...diacriticXs)) / 2;
                const offset = diacriticCenter - stemTop;

                // Diacritic offset should stay within 2 units of default
                assert.ok(
                    Math.abs(offset - defaultOffset) < 2,
                    `${char} diacritic offset at wdth=${wdth} (${offset.toFixed(1)}) differs from default (${defaultOffset.toFixed(1)})`
                );
            }
        }
    });

    it('correctly varies advance width for nested composites with rotated base (ü)', function() {
        if (!karioFont) {
            this.skip();
            return;
        }

        // "ü" is a composite: "u" (which is rotated "n") + umlaut diacritic
        // The phantom points may have incorrect variation data, so we must
        // detect inconsistency and fall back to component-based calculation
        const umlautU = karioFont.charToGlyph('ü');
        umlautU.getPath();

        // Get advance widths at different wdth values
        const advanceWidths = {};
        for (const wdth of [46, 100, 123]) {
            karioFont.variation.set({wdth});
            const transformed = karioFont.variation.getTransform(umlautU, {wdth});
            advanceWidths[wdth] = transformed.advanceWidth;
        }

        // Advance width should scale with wdth axis, not stay near default
        assert.ok(
            advanceWidths[46] < 300,
            `ü at wdth=46 should have narrow advanceWidth (${advanceWidths[46].toFixed(0)}), not ${advanceWidths[100].toFixed(0)}`
        );
        assert.ok(
            advanceWidths[46] < advanceWidths[100],
            `ü advanceWidth at wdth=46 (${advanceWidths[46].toFixed(0)}) should be less than at wdth=100 (${advanceWidths[100].toFixed(0)})`
        );
        assert.ok(
            advanceWidths[100] < advanceWidths[123],
            `ü advanceWidth at wdth=100 (${advanceWidths[100].toFixed(0)}) should be less than at wdth=123 (${advanceWidths[123].toFixed(0)})`
        );
    });
});