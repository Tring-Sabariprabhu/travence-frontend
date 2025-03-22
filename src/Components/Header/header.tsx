import './header.scss';
interface NavItem {
    label: string;
    onClick?: () => void;
}

interface HeaderProps {
    items: NavItem[];
}

export const Header: React.FC<HeaderProps> = ({ items }) => {
    return (
        <div className='header'>
            <ol>
                {items.map((item, index) => (
                    <li key={index} onClick={item.onClick}>
                        <label>{item.label}</label>
                    </li>
                ))}
            </ol>
        </div>
    )
}