import React from "react";
import TimerLap from "@/components/TimerLap";
import { FileArrowDown } from "phosphor-react";
import Tooltip from "@/components/Tooltip";
import { useAtom } from "jotai";
import { maxTimeAtom } from "@/components/Timer";
import { displayHoursFull, displayMinutesFull, displaySecondsFull, msToTime } from "@/mixins";

const defaultLap = { hours: 0, minutes: 0, seconds: 0, milliseconds: "000", duration: 0 };

export default function TimerLaps({ laps }) {
	const maxTime = useAtom(maxTimeAtom);
	const csvLaps = laps
		.map((lap, index) => {
			const previousLap = index - 1 in laps ? laps[index - 1] : defaultLap;
			const delta = msToTime(lap.duration - previousLap.duration, maxTime);
			return `"${displayHoursFull(lap)}:${displayMinutesFull(lap)}:${displaySecondsFull(lap)}.${lap.milliseconds}";"${displayHoursFull(
				delta
			)}:${displayMinutesFull(delta)}:${displaySecondsFull(delta)}.${delta.milliseconds}"`;
		})
		.join("\n");
	const csvContent = `"Durée";"Delta"\n` + csvLaps;

	const download = () => {
		const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
		if (navigator.msSaveBlob) {
			navigator.msSaveBlob(blob, "data.csv");
		} else {
			const link = document.createElement("a");
			if (link.download !== undefined) {
				const url = URL.createObjectURL(blob);
				link.setAttribute("href", url);
				link.setAttribute("download", "data.csv");
				link.style.visibility = "hidden";
				document.body.appendChild(link);
				link.click();
				document.body.removeChild(link);
			}
		}
	};

	return (
		!!laps.length && (
			<div className="py-12">
				<div className="grid grid-cols-3 w-full px-4 py-2 place-content-end items-end">
					<span className="text-sm uppercase">Durée</span>
					<span className="text-sm uppercase">Delta</span>
					<Tooltip content={"Exporter"}>
						<button
							onClick={download}
							className="relative justify-self-end flex justify-center items-center p-2 bg-white rounded-lg text-gray-600 shadow transform active:scale-95 transition-transform duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-gray-50"
						>
							<FileArrowDown size={24} />
						</button>
					</Tooltip>
				</div>
				<div className="flex flex-col gap-y-4">
					{laps.map((lap, index) => (
						<TimerLap key={`timerlap-${index}`} lap={lap} index={index} previousLap={index - 1 in laps ? laps[index - 1] : defaultLap} />
					))}
				</div>
			</div>
		)
	);
}
