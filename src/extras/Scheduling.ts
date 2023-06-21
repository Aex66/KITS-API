/**
import { world } from '@minecraft/server';
const tickTimeoutMap = new Map();
const tickIntervalMap = new Map();
let tickTimeoutID = 0, tickIntervalID = 0;
world.events.tick.subscribe((data) => {
    for (const [ID, tickTimeout] of tickTimeoutMap) {
        tickTimeout.tick--;
        if (tickTimeout.tick <= 0) {
            tickTimeout.callback(...tickTimeout.args);
            tickTimeoutMap.delete(ID);
        }
        ;
    }
    ;
    for (const [, tickInterval] of tickIntervalMap) {
        if (data.currentTick % tickInterval.tick === 0)
            tickInterval.callback(...tickInterval.args);
    }
    ;
});
function setTickTimeout(handler: string | Function, timeout: number, ...args: any[]) {
    const tickTimeout = { callback: handler, tick: timeout, args };
    tickTimeoutID++;
    tickTimeoutMap.set(tickTimeoutID, tickTimeout);
    return tickTimeoutID;
}
;
/**
function setTickInterval(handler: Function, timeout: number, ...args: any[]) {
    const tickInterval = { callback: handler, tick: timeout, args };
    tickIntervalID++;
    tickIntervalMap.set(tickIntervalID, tickInterval);
    return tickIntervalID;
}
;
function clearTickTimeout(handle: number) {
    tickTimeoutMap.delete(handle);
}
;
function clearTickInterval(handle: number) {
    tickIntervalMap.delete(handle);
}
;
export { setTickTimeout, setTickInterval, clearTickTimeout, clearTickInterval };
*/

/*
ROT Developers and Contributors:
Moises (OWNER/CEO/Developer),
notbeer (ROT's base code)
-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
__________ ___________________
\______   \\_____  \__    ___/
 |       _/ /   |   \|    |
 |    |   \/    |    \    |
 |____|_  /\_______  /____|
        \/         \/
-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
© Copyright 2023 all rights reserved by Mo9ses. Do NOT steal, copy the code, or claim it as yours!
Please message Mo9ses#8583 on Discord, or join the ROT discord: https://discord.com/invite/2ADBWfcC6S
Website: https://www.rotmc.ml
Docs: https://docs.google.com/document/d/1hasFU7_6VOBfjXrQ7BE_mTzwacOQs5HC21MJNaraVgg
Thank you!
*/
import { system, world } from '@minecraft/server';
/**
* Defines:
*/
const tickTimeoutMap = new Map(), tickIntervalMap = new Map();
let totalTick = 0, tickIntervalID = 0, tickTimeoutID = 0;
system.runInterval(() => {
    totalTick++;
    for(const [ID, tickTimeout] of tickTimeoutMap) {
        tickTimeout.tick--;
        if(tickTimeout.tick <= 0) {
            tickTimeout.callback(...tickTimeout.args);
            tickTimeoutMap.delete(ID);
        }
    }
    for(const [, tickInterval] of tickIntervalMap) {
        if(totalTick % tickInterval.tick === 0) tickInterval.callback(...tickInterval.args)
    }
});
/**
 * Delay executing a function, REPEATEDLY
 * @param {string | Function} handler Function you want to execute
 * @param {number} [timeout] Time delay in ticks. 20 ticks is 1 second
 * @param {any[]} args Function parameters for your handler
 * @returns {number}
 */
export const setTickInterval = (handler: Function, timeout?: number, ...args: any[]): number => {
    const tickInterval = { callback: handler, tick: timeout, args };
    tickIntervalID++;
    tickIntervalMap.set(tickIntervalID, tickInterval);
    return tickIntervalID;
};

/**
 * Delay executing a function
 * @param {Function} handler
 * @param {number} timeout
 * @param {any[]} args
 * @returns {number}
 */
export const setTickTimeout = (handler: Function, timeout?: number, ...args: any[]): number => {
    const tickTimeout = { callback: handler, tick: timeout, args };
    tickTimeoutID++;
    tickTimeoutMap.set(tickTimeoutID, tickTimeout)
    return tickTimeoutID
}