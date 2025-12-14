/**
 * Ligature sequence context checkers
 */

import { isWhiteSpace } from '../../../char.mjs';

function ligatureSequenceStartCheck(contextParams) {
    const char = contextParams.current;
    const prevChar = contextParams.get(-1);
    return (
        (prevChar === null && !isWhiteSpace(char)) ||
        (isWhiteSpace(prevChar) && !isWhiteSpace(char))
    );
}

function ligatureSequenceEndCheck(contextParams) {
    const nextChar = contextParams.get(1);
    return (
        (nextChar === null) ||
        (isWhiteSpace(nextChar))
    );
}

export default {
    startCheck: ligatureSequenceStartCheck,
    endCheck: ligatureSequenceEndCheck
};
