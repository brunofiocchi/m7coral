import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
    Tooltip,
    XAxis,
    AreaChart,
    Area,
    ResponsiveContainer,
    CartesianGrid
} from "recharts";

import { CustomToolTip } from "./custom-tooltip";

type Props = {
    data: {
        date: string;
        income: number;
        expenses: number;
    }[];
};

export const AreaVariant = ({ data }: Props) => {
    return (
        <ResponsiveContainer width="100%" height={350}>
            <AreaChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <defs>
                    <linearGradient id="income" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="2%" stopColor="#02b3b3" stopOpacity={0.8} />
                        <stop offset="98%" stopColor="#02b3b3" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="expenses" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="2%" stopColor="#f43f5e" stopOpacity={0.8} />
                        <stop offset="98%" stopColor="#f43f5e" stopOpacity={0} />
                    </linearGradient>
                </defs>
                <XAxis
                    axisLine={false}
                    tickLine={false}
                    dataKey="date"
                    tickFormatter={(value) => format(new Date(value), "dd MMM", { locale: ptBR })}
                    style={{ fontSize: "12px" }}
                    tickMargin={16}
                />
                <Tooltip content={<CustomToolTip />} />
                <Area
                    type="monotone"
                    dataKey="income"
                    stackId="income"
                    strokeWidth={2}
                    stroke="#02b3b3"
                    fill="url(#income)"
                    className="drop-shadow-sm"
                />
                <Area
                    type="monotone"
                    dataKey="expenses"
                    stackId="expenses"
                    strokeWidth={2}
                    stroke="#f43f5e"
                    fill="url(#expenses)"
                    className="drop-shadow-sm"
                />
            </AreaChart>
        </ResponsiveContainer>
    );
};
