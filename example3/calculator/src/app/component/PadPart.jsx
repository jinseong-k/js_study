import {useCallback} from "react";
import {useStoreContext} from "../hooks";
import {isClear, isDot, isEqual, isNumber} from "../util";
import {DOT, OPS} from "../const";

const OP_PAD = ["C", ...OPS];
const NUM_PAD = [
    "7", "8", "9",
    "4", "5", "6",
    "1", "2", "3",
    ".", "0", "="
];

function ButtonPad({item, onClick}) {
    const handleClick = useCallback(() => {
        onClick(item);
    }, [item, onClick]);

    return (
        <button className="item" value={item} onClick={handleClick}>
            {item}
        </button>
    )
}

function NumPadPart() {
    const {input, setInput, calc} = useStoreContext();
    const handleClick = useCallback((item) => {
        if (isDot(item)) {
            if (input?.includes(DOT)) {
                return;
            }

            setInput(`${+input}${DOT}`);

            return;
        }

        if (isNumber(item)) {
            if (input === null) {
                setInput(item);

                return;
            }

            setInput(`${input}${item}`);

            return;
        }

        if (isEqual(item)) {
            calc();

            return;
        }
    }, [input, setInput, calc]);

    return (
        <div className="num-pad">
            {NUM_PAD.map((item) => <ButtonPad key={item} item={item} onClick={handleClick} />)}
        </div>
    )
}

function OpPadPart() {
    const {clear, setOp} = useStoreContext();
    const handleClick = useCallback((item) => {
        if (isClear(item)) {
            clear();

            return;
        }

        setOp(item);
    }, [clear, setOp]);

    return (
        <div className="op-pad">
            {OP_PAD.map((item) => <ButtonPad key={item} item={item} onClick={handleClick} />)}
        </div>
    )
}

export function PadPart() {
    return (
        <div className="pad">
            {/* todo <HistoryPadPart /> */}
            {/* todo <ActionPadPart /> */}
            <NumPadPart />
            <OpPadPart />
        </div>
    )
}

// const actionList = {
//     "undo":"undo", "redo":"redo"
// };
// const historyList = {
//     "clear":"clear History",
//     "load":"load History",
//     "save":"save History"
// };
// const historyPadArray = [
//     "clear History",
//     "load History",
//     "save History"
// ];
//
//
// function HistoryPadPart() {
//     function handleHistoryPadEvent(e) {
//         const key = e.target.value;
//         console.log(key);
//         switch (key) {
//             case historyList["save"]:
//                 history.handleSaveHistoryButton();
//                 break;
//             case historyList["load"]:
//                 history.handleLoadHistoryButton();
//                 break;
//             case historyList["clear"]:
//                 history.handleClearHistoryButton();
//                 break;
//             default:
//                 console.log("Invalid key");
//                 break;
//         }
//     }
//
//     return (
//         <div className="history-pad">
//             {historyPadArray.map((item) => {
//                 return <ButtonPad key={item}
//                                   itemValue={item}
//                                   handleEvent={handleHistoryPadEvent} />;
//             })}
//         </div>
//     );
// }
//
// const actionHistoryArray = ["undo", "redo", ""];
//
// function ActionPadPart() {
//     const {result, setInput, setResult} = useStoreContext();
//     // const calculator = useCalculatorContext();
//
//     function handleActionButton(e) {
//         switch (e.target.value) {
//             case actionList.redo:
//                 processRedo();
//                 return;
//             case actionList.undo:
//                 processUndo();
//                 return;
//             default:
//                 return;
//         }
//     }
//
//     function processUndo() {
//         setResult(history.undo());
//         calculator.setValue(result);
//         setInput(null);
//     }
//
//     function processRedo() {
//         setResult(history.redo());
//         setInput(null);
//     }
//
//     return (
//         <div className="action-pad">
//             {actionHistoryArray.map((item) => {
//                 return <ButtonPad key={item}
//                                   itemValue={item}
//                                   handleEvent={handleActionButton} />;
//             })}
//         </div>
//     );
// }

