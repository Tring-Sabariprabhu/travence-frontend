import { useState } from "react"
import InputField from "../../../../Components/InputField/InputField"
import TextAreaField from "../../../../Components/TextAreaField/TextAreaField"
import ButtonField from "../../../../Components/ButtonField/ButtonField"

interface ToDoprops {
    description: string
    budget: number
}
export const ToDo = () => {
    const [rows, setRows] = useState<ToDoprops[]>([{ description: "", budget: 0 }]);
    const addOneRow = () => {
        setRows([...rows, { description: "", budget: 0 }]);
    }
    const deleteOneRow = (index: number) => {
        const oldRows = [...rows];
        oldRows.splice(index, 1);
        setRows(oldRows);
    }
    return (
        <div className="trip-todo">
            <h3>To Do List</h3>
            <div className="container">
                {
                    rows.map((row, index) => (
                        <div key={index} className="todo">
                            <TextAreaField label={""} 
                                name={"todo"} 
                                placeholder={"To do"} />
                            <InputField type={"text"} 
                                label={""} 
                                name={"budget"} 
                                placeholder={"Expense"} />
                            <ButtonField type={"button"} 
                                text={"Add To Do"} 
                                onClick={addOneRow} 
                                className={"blue_button"} />
                            {rows?.length > 1 &&
                                <ButtonField type={"button"} text={"Remove"} onClick={() => deleteOneRow(index)} className={"red_button"} />}
                        </div>
                    ))
                }
               
            </div>
        </div>
    )
}