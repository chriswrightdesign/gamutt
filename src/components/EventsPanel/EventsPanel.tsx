import React from "react";
import "./EventsPanel.css";

export interface LoggedEvent {
    id: number;
    name: string;
    detail: unknown;
    time: number;
}

interface EventsPanelProps {
    events: LoggedEvent[];
    onClear: () => void;
}

const formatTime = (time: number): string => new Date(time).toLocaleTimeString();

const safeStringify = (value: unknown): string => {
    try {
        return JSON.stringify(value);
    } catch {
        return String(value);
    }
};

const EventsPanel = ({events, onClear}: EventsPanelProps) => {
    if (events.length === 0) {
        return null;
    }

    return (
        <div className="gmt-events">
            <div className="gmt-events__header">
                <span className="gmt-events__title">Events</span>
                <button type="button" className="gmt-events__clear" onClick={onClear}>
                    Clear
                </button>
            </div>
            <ul className="gmt-events__list">
                {events.map((event) => (
                    <li key={event.id} className="gmt-events__item">
                        <code className="gmt-events__name">{event.name}</code>
                        {event.detail !== undefined && event.detail !== null ? (
                            <span className="gmt-events__detail">{safeStringify(event.detail)}</span>
                        ) : null}
                        <time className="gmt-events__time">{formatTime(event.time)}</time>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export {EventsPanel};
