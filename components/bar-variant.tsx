import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
    Tooltip,
    XAxis,
    ResponsiveContainer,
    BarChart,
    Bar,
    CartesianGrid
} from "recharts";

import { CustomToolTip } from "@/components/custom-tooltip";

type Props = {
    data: {
        date: string;
        income: number;
        expenses: number;
    }[];
};

export const BarVariant = ({ data }: Props) => {
    return (
        <ResponsiveContainer width="100%" height={350}>
            <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                    axisLine={false}
                    tickLine={false}
                    dataKey="date"
                    tickFormatter={(value) => format(new Date(value), "dd MMM", { locale: ptBR })}
                    style={{ fontSize: "12px" }}
                    tickMargin={16}
                />
                <Tooltip content={<CustomToolTip />} />
                <Bar
                    dataKey="income"
                    fill="#02b3b3"
                    className="drop-shadow-sm"
                />
                <Bar
                    dataKey="expenses"
                    fill="#f43f5e"
                    className="drop-shadow-sm"
                />
            </BarChart>
        </ResponsiveContainer>
    );
};