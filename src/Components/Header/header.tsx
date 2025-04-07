import './header.scss';
import logo from '../../Assets/images/travence-logo.png';
import { ArrowBackIcon } from '../ArrowBack/ArrowBack';
interface NavItem {
    label: string;
    onClick?: () => void;
}

interface HeaderProps {
    items?: NavItem[];
    
}

export const Header: React.FC<HeaderProps> = ({ items }) => {
    return (
        <div className='header'>
            <div>
                <ArrowBackIcon/>
                <ol>            
                    {items && items.map((item, index) => (
                        <li key={index} onClick={item.onClick}>
                            <label>{item.label}</label>
                        </li>
                    ))}
                </ol>
            </div>
            <img src={logo} alt="" />
        </div>
    )
}