import { useState } from "react";
import InputField from "../../../../Components/InputField/InputField"
import ButtonField from "../../../../Components/ButtonField/ButtonField";
import TextAreaField from "../../../../Components/TextAreaField/TextAreaField";

interface item {
    item_name: string
}
interface packages {
    package_name: string
    items: [item]
}
export const CheckLists = () => {
    const [packages, setPackages] = useState<packages[]>([
        {
            package_name: "",
            items: [
                {
                    item_name: ""
                }
            ]
        }
    ]);
    const addPackage = () => {
        setPackages([...packages,
        {
            package_name: "",
            items: [
                {
                    item_name: ""
                }
            ]
        }
        ])
    }
    const deletePackage = (packIndex: number) => {
        const newPackages = [...packages];
        newPackages.splice(packIndex, 1);
        setPackages(newPackages);
    }
    const addItemToPackage = (packindex: number) => {
        const newPackages = [...packages];
        newPackages[packindex].items.push({ item_name: "New Item" });
        setPackages(newPackages);
    }
    const deleteItemFromPackage = (packIndex: number, itemIndex: number) => {
        const newPackages = [...packages];
        newPackages[packIndex].items.splice(itemIndex, 1);
        setPackages(newPackages);
    }
    return (
        <div className="trip-checklists">
            <h3>CheckLists</h3>
            <div className="container">
                
                {packages?.length > 0 &&
                    packages?.map((pack, pack_index) => (
                        <div className="package" key={pack_index}>
                            <div>
                                <InputField type={"text"}
                                    label={""}
                                    name={"package-title"}
                                    placeholder={"Package name"} />
                                <ButtonField type={"button"} 
                                    text={"Add package"} 
                                    className={"blue_button"} 
                                    onClick={addPackage} />
                                {
                                    packages.length > 1 &&
                                    <ButtonField type={"button"}
                                        text={"Delete package"}
                                        className={"red_button"}
                                        onClick={() => deletePackage(pack_index)} />
                                }
                            </div>
                            {pack?.items?.length > 0 &&
                                pack?.items?.map((item, item_index) => (
                                    <div className="package-items" key={item_index}>
                                        <TextAreaField
                                            label={""}
                                            name={"package-item"}
                                            placeholder={"About item "} className={""} />
                                        <ButtonField
                                            type={"button"}
                                            text={"Add item"}
                                            className={"blue_button"}
                                            onClick={() => addItemToPackage(pack_index)} />
                                        {
                                            pack?.items?.length > 1 &&
                                            <ButtonField type={"button"}
                                                text={"Delete item"}
                                                className={"red_button"}
                                                onClick={() => deleteItemFromPackage(pack_index, item_index)} />
                                        }
                                    </div>
                                ))
                            }
                        </div>
                    ))

                }

            </div>
        </div>
    )
}