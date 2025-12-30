import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setMode, setAlphabetType } from '../../../features/codewords/codewordsSlice';
import ControlSection from '../../common/Controls/ControlSection';

const ControlsCodewordsMode = () => {
    const dispatch = useDispatch();
    const { mode, alphabetType } = useSelector(state => state.puzzles.codewords);

    const handleModeChange = (newMode) => {
        dispatch(setMode(newMode));
    };

    return (
        <ControlSection title="Game Mode">
            <div className="control-subsection">
                <label>Mode:</label>
                <div className="radio-group-segmented">
                    <input
                        type="radio"
                        id="mode-setup"
                        name="codewords-mode"
                        value="setup"
                        checked={mode === 'setup'}
                        onChange={() => handleModeChange('setup')}
                    />
                    <label htmlFor="mode-setup">Setup</label>

                    <input
                        type="radio"
                        id="mode-solve"
                        name="codewords-mode"
                        value="solve"
                        checked={mode === 'solve'}
                        onChange={() => handleModeChange('solve')}
                    />
                    <label htmlFor="mode-solve">Solve</label>
                </div>
            </div>

            <div className="control-subsection" style={{ marginTop: '10px' }}>
                <label>Alphabet:</label>
                <div className="radio-group-segmented">
                    <input
                        type="radio"
                        id="lang-en"
                        name="codewords-lang"
                        value="EN"
                        checked={alphabetType === 'EN'}
                        onChange={() => dispatch(setAlphabetType('EN'))}
                    />
                    <label htmlFor="lang-en">EN</label>

                    <input
                        type="radio"
                        id="lang-lt"
                        name="codewords-lang"
                        value="LT"
                        checked={alphabetType === 'LT'}
                        onChange={() => dispatch(setAlphabetType('LT'))}
                    />
                    <label htmlFor="lang-lt">LT</label>
                </div>
            </div>
        </ControlSection>
    );
};

export default ControlsCodewordsMode;
