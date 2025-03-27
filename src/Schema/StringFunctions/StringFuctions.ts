
interface NameProps {
    name: string;
}

export const capitalizeName = ({ name }: NameProps) => {
    if (name.length > 0)
        return name.charAt(0).toUpperCase() + name.slice(1);
    return "";
};


interface DateProps {
    date: string;
}

export const dateformat = ({ date }: DateProps) => {
    if (date.length > 0) {
        const formattedDate = new Date(date).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric"
        });
        return formattedDate;
    }
    return "";
}
