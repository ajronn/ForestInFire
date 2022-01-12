import React, { useEffect, useRef } from "react";
import style from "./Board.module.css"

const colorMap = [
    '#33ff33',
    '#1aff1a',
    '#00ff00',
    '#00e600',
    '#00cc00',
    '#00b300',
    '#009900',
    '#008000',
    '#006600',
    '#004d00',
    '#003300',
    '#ff0000',
    '#e60000',
    '#990000',
    '#666666',
    '#404040',
    '#000000',
    '#0040ff',
    '#0039e6',
    '#0033cc',
    '#002db3']

interface Props {
    board: number[][],
    cellSide: number
}

const Board = (props: Props) => {
    let canvasRef = useRef<HTMLCanvasElement | null>(null);
    let canvasCtxRef = React.useRef<CanvasRenderingContext2D | null>(null);

    useEffect(() => {
        if (canvasRef.current) {
            canvasCtxRef.current = canvasRef.current.getContext('2d');
            let ctx = canvasCtxRef.current;
            for (let i = 0; i < props.board.length; i++) {
                for (let j = 0; j < props.board[i].length; j++) {
                    let x = j * props.cellSide;
                    let y = i * props.cellSide;
                    ctx!.beginPath();
                    ctx!.fillStyle = colorMap[props.board[i][j]];
                    ctx!.fillRect(x, y, props.cellSide, props.cellSide);
                }
            }
        }
    }, [props])


    return (
        <canvas className={style.board} ref={canvasRef} width={props.board[0] ? props.board[0].length * props.cellSide : 0} height={props.board ? props.board.length * props.cellSide : 0}></canvas>
    )
}

export default Board;