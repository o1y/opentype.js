import assert from 'assert';
import { parse } from '../src/opentype.mjs';
import { readFileSync } from 'fs';
import { resolve } from 'path';

describe('Ligature substitution', function() {
    let font;

    before(function() {
        const fontPath = resolve('./test/fonts/Kario39C3VarWEB-Roman.woff');
        try {
            const buffer = readFileSync(fontPath);
            font = parse(buffer.buffer);
        } catch (e) {
            this.skip();
        }
    });

    it('should have liga feature for latn script', function() {
        const latnScript = font.tables.gsub.scripts.find(s => s.tag === 'latn');
        assert.ok(latnScript, 'Font should have latn script');

        const featureIndexes = latnScript.script.defaultLangSys?.featureIndexes || [];
        const features = featureIndexes.map(i => font.tables.gsub.features[i]);
        const hasLiga = features.some(f => f.tag === 'liga');
        assert.ok(hasLiga, 'Font should have liga feature');
    });

    it('should apply ligature substitution to <<CCC', function() {
        const text = '<<CCC';
        const options = { features: { liga: true, rlig: true } };

        const glyphIndexes = font.stringToGlyphIndexes(text, options);
        assert.deepStrictEqual(glyphIndexes, [594], 'Should produce ligature glyph 594');
    });

    it('should apply ligature substitution to <<ccc', function() {
        const text = '<<ccc';
        const options = { features: { liga: true, rlig: true } };

        const glyphIndexes = font.stringToGlyphIndexes(text, options);
        assert.deepStrictEqual(glyphIndexes, [595], 'Should produce ligature glyph 595');
    });

    it('should return single glyph object with stringToGlyphs', function() {
        const text = '<<CCC';
        const options = { features: { liga: true, rlig: true } };

        const glyphs = font.stringToGlyphs(text, options);
        assert.strictEqual(glyphs.length, 1, 'Should have 1 glyph after ligature substitution');
        assert.strictEqual(glyphs[0].index, 594, 'Should be glyph 594 (uniE003)');
    });
});
