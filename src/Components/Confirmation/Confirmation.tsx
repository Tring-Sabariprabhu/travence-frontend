
import ButtonField from "../ButtonField/ButtonField";
import CustomDialog from "../CustomDialog/CustomDialog"
import './Confirmation.scss';

interface ConfirmationProps {
    open: boolean
    onSuccess?: () => void
    onClose: () => void
    title: string
    closeButtonText?: string
    confirmButtonText: string
}
export const Confirmation: React.FC<ConfirmationProps> = ({ open, onSuccess, onClose, title, closeButtonText, confirmButtonText }) => {
    return (
        <CustomDialog open={open} onClose={onClose} dialog_title={""}>
            <div className='confirmation-container'>
                <p>{title}</p>
                <div className="buttons">
                    <ButtonField
                        type={"button"}
                        text={confirmButtonText}
                        onClick={onSuccess ? onSuccess : onClose}
                        className={"blue_button"} />
                    {closeButtonText && <ButtonField type={"button"} text={closeButtonText} onClick={onClose} />}
                </div>

            </div>
        </CustomDialog>
    )
}