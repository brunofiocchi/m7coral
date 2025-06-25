import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
    Tooltip,
    XAxis,
    ResponsiveContainer,
    LineChart,
    Line,
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

export const LineVariant = ({ data }: Props) => {
    return (
        <ResponsiveContainer width="100%" height={350}>
            <LineChart data={data}>
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
                <Line
                    dot={false}
                    dataKey="income"
                    stroke="#02b3b3"
                    strokeWidth={2}
                    className="drop-shadow-sm"
                />
                <Line
                    dot={false}
                    dataKey="expenses"
                    stroke="#f43f5e"
                    strokeWidth={2}
                    className="drop-shadow-sm"
                />
            </LineChart>
        </ResponsiveContainer>
    );
};