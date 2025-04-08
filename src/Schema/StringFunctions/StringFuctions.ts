

interface DateProps {
    timestamp: string;
}

export const dateformat = ({ timestamp }: DateProps) => {
    if (timestamp.length > 0) {
        const formattedDate = new Date(timestamp).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric"
        });
        return formattedDate;
    }
    return "";
}
