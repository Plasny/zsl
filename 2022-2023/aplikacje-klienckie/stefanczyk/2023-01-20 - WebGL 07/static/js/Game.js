import { changeTurn, getBoard, player, sendMove } from "./Net.js";
import { toggleLoading, toggleWaitingForMove, resetTimer } from "./UI.js";
import { CheckersBoard } from "./game-classes/Board.js";
import { CheckersPawn } from "./game-classes/Pawn.js";

export const texturePath = 'mats/marble.webp';
const boardSize = 100;

export class Game {
    constructor(id) {
        this.scene = new THREE.Scene();

        this.camera = new THREE.PerspectiveCamera(
            45, window.innerWidth / window.innerHeight, 0.1, 10000
        );
        this.camera.position.set(0, 500, 0);
        this.camera.lookAt(this.scene.position);

        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setClearColor(0x000030);

        this.scene.add(new THREE.AxesHelper(1000));
        this.spacing = boardSize;
        this.board3d = new CheckersBoard(this.spacing);
        this.scene.add(this.board3d);

        this.raycaster = new THREE.Raycaster();

        this.lastPawn;
        this.selected;
        this.yourTurn = false;
        this.highlighted = [];
        this.killStreak = false;

        document.getElementById(id).append(this.renderer.domElement);
        window.addEventListener("resize", this.onWindowResize);
        window.addEventListener("mousedown", this.Click);

        this.render();
    }

    translatePosition = (x) => (x - 3.5) * this.spacing;

    addPawn(player, x, z) {
        let pawn;

        if (player == 1)
            pawn = new CheckersPawn({});
        else if (player == 2)
            pawn = new CheckersPawn({ dark: true });
        else
            return;

        pawn.position.x = this.translatePosition(x);
        pawn.position.y = 20;
        pawn.position.z = this.translatePosition(z);
        pawn.name = `pawn-${player}`;
        pawn.userData.pawn = true;
        pawn.userData.player = player;
        pawn.userData.x = x;
        pawn.userData.z = z;

        this.scene.add(pawn);
        return pawn;
    }

    onWindowResize = () => {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    };

    render = () => {
        this.renderer.render(this.scene, this.camera);
        TWEEN.update();
        requestAnimationFrame(this.render);
    };

    ChooseSide = async (color) => {
        toggleLoading();

        if (color == 'white') {
            this.camera.position.set(0, 600, -1000);
        }
        else {
            this.camera.position.set(0, 600, 1000);
            toggleWaitingForMove();
        }

        this.camera.lookAt(this.scene.position);

        this.board = await getBoard();
        this.board.obj = new Array(this.board.pawns.length);
        for (let i = 0; i < this.board.pawns.length; i++) {
            this.board.obj[i] = new Array(this.board.pawns[i].length);
            for (let j = 0; j < this.board.pawns[i].length; j++) {
                this.board.obj[i][j] = this.addPawn(this.board.pawns[i][j], i, j);
            }
        }

        toggleLoading();
        // setTimeout(toggleLoading, 1);
    };

    possibleMoves(chosen) {
        const c = chosen.userData;
        const p = this.board.pawns;

        let side;
        player.nr == 1 ? side = 1 : side = -1;
        let opponent = 3 - player.nr;

        let highlight = [];

        let kill = false;

        if (c.super) {
            const iTypes = [
                { x: 1, z: 1 },
                { x: 1, z: -1 },
                { x: -1, z: 1 },
                { x: -1, z: -1 },
            ];

            for (const t of iTypes) {
                let x = c.x;
                let z = c.z;

                while (true) {
                    x += t.x;
                    z += t.z;

                    if (x < 0 || z < 0 || x >= p.length || z >= p.length) break;

                    if (p[x][z] == 0) highlight.push({ x: x, z: z });
                }
            }
        } else {
            let z = c.z + side;
            let x = c.x + 1;
            if (!kill && x < p.length && p[x][z] == 0) {
                highlight.push({ x: c.x + 1, z: z });
            }
            if (x < p.length && p[x][z] == opponent && x < p.length - 1 && p[c.x + 2][c.z + 2 * side] == 0) {
                kill = true;
                highlight.push({ x: c.x + 2, z: c.z + 2 * side });
            }
            z = c.z - side;
            if (x < p.length - 1 && p[x][z] == opponent && p[c.x + 2][c.z - 2 * side] == 0) {
                kill = true;
                highlight.push({ x: c.x + 2, z: c.z - 2 * side });
            }
            z = c.z + side;
            x = c.x - 1;
            if (x >= 0 && p[x][z] == opponent && x > 0 && p[c.x - 2][c.z + 2 * side] == 0) {
                kill = true;
                highlight.push({ x: c.x - 2, z: c.z + 2 * side });
            }
            z = c.z - side;
            if (x > 0 && p[x][z] == opponent && p[c.x - 2][c.z - 2 * side] == 0) {
                kill = true;
                highlight.push({ x: c.x - 2, z: c.z - 2 * side });
            }

            z = c.z + side;
            x = c.x - 1;
            if (!kill && x >= 0 && p[x][z] == 0) {
                highlight.push({ x: c.x - 1, z: z });
            }
            x = c.x + 1;
            if (!kill && x < p.length && p[x][z] == 0) {
                highlight.push({ x: c.x + 1, z: z });
            }
        }

        for (const tail of this.board3d.children) {
            for (const el of highlight) {
                if (tail.userData.x == el.x && tail.userData.z == el.z) {
                    tail.Select();
                    this.highlighted.push(tail);

                    highlight.splice(highlight.indexOf(el), 1);
                }
            }
        }
    };

    isMoveOk(chosen) {
        const n = chosen.userData;
        const o = this.lastPawn.userData;
        const p = this.board.pawns;
        const opponent = 3 - player.nr;

        let side;
        player.nr == 1 ? side = 1 : side = -1;

        if (o.super) {
            const iTypes = [
                { x: 1, z: 1 },
                { x: 1, z: -1 },
                { x: -1, z: 1 },
                { x: -1, z: -1 },
            ];

            let possible = [];

            for (const t of iTypes) {
                let x = o.x;
                let z = o.z;
                let possibleKills = [];

                while (true) {
                    x += t.x;
                    z += t.z;

                    if (x < 0 || z < 0 || x >= p.length || z >= p.length) break;

                    if (p[x][z] == opponent) possibleKills.push({ x: x, z: z });
                    if (p[x][z] == 0) possible.push({ x: x, z: z, kill: [...possibleKills] });
                }
            }

            for (const el of possible) {
                if (n.x === el.x && n.z === el.z) return { ok: true, kill: el.kill };
            }
        } else {
            if (p[n.x][n.z] == 0) {
                if (o.z + side == n.z && (o.x + 1 == n.x || o.x - 1 == n.x)) {
                    return { ok: true };
                }
            }

            if (o.z + (2 * side) == n.z) {
                const z = o.z + side;
                let x = o.x + 1;
                if (o.x + 2 == n.x && x < p.length && p[x][z] == opponent) {
                    return { ok: true, kill: [{ x: x, z: z }] };
                }
                x = o.x - 1;
                if (o.x - 2 == n.x && x >= 0 && p[x][z] == opponent) {
                    return { ok: true, kill: [{ x: x, z: z }] };
                }
            }

            if (o.z - 2 * side == n.z) {
                const z = o.z - side;
                let x = o.x + 1;
                if (o.x + 2 == n.x && x < p.length && p[x][z] == opponent) {
                    return { ok: true, kill: [{ x: x, z: z }] };
                }
                x = o.x - 1;
                if (o.x - 2 == n.x && x >= 0 && p[x][z] == opponent) {
                    return { ok: true, kill: [{ x: x, z: z }] };
                }
            }
        }

        return { ok: false };
    };

    checkForKill() {
        const o = this.lastPawn.userData;
        const p = this.board.pawns;
        const opponent = 3 - player.nr;

        console.log('check');
        if (o.super) {
            // todo
        } else {
            if (o.x < p.length && p[o.x + 1][o.z + 1] == opponent) return true;
            if (o.x < p.length && p[o.x + 1][o.z - 1] == opponent) return true;
            if (o.x > 0 && p[o.x - 1][o.z + 1] == opponent) return true;
            if (o.x > 0 && p[o.x - 1][o.z - 1] == opponent) return true;
        }

        return false;
    };

    Click = (e) => {
        if (!this.yourTurn) return;

        const mouseVector = new THREE.Vector2();

        mouseVector.x = (e.clientX / window.innerWidth) * 2 - 1;
        mouseVector.y = -(e.clientY / window.innerHeight) * 2 + 1;
        this.raycaster.setFromCamera(mouseVector, this.camera);
        const intersects = this.raycaster.intersectObjects(this.scene.children);

        if (intersects.length > 0) {
            const chosen = intersects[0].object;

            if (chosen.userData.pawn && chosen.userData.player == player.nr) {
                if (this.lastPawn != undefined) {
                    this.lastPawn.Unselect();
                    while (this.highlighted.length > 0) {
                        this.highlighted.pop().Unselect();
                    }
                }

                chosen.Select();

                this.possibleMoves(chosen);

                this.lastPawn = chosen;
                this.selected = true;
            } else {
                if (this.selected) {
                    this.selected = false;
                    this.lastPawn.Unselect();
                    while (this.highlighted.length > 0) {
                        this.highlighted.pop().Unselect();
                    }

                    if (!chosen.userData.ok) return;

                    const isOk = this.isMoveOk(chosen);
                    if (!isOk.ok) return;

                    if (isOk.kill && isOk.kill.length > 0)
                        this.killStreak = true;
                    else
                        this.killStreak = false;

                    const move = {
                        old: {
                            x: this.lastPawn.userData.x,
                            z: this.lastPawn.userData.z
                        },
                        new: {
                            x: chosen.userData.x,
                            z: chosen.userData.z
                        },
                        changeTurn: !this.killStreak,
                        kill: isOk.kill
                    };


                    this.makeMove(move, player.nr);
                    sendMove(move);

                    if (this.killStreak) {
                        console.log('kill');
                        if (!this.checkForKill()) {
                            toggleWaitingForMove();
                            this.yourTurn = false;
                            changeTurn();
                        }
                    }
                }
            }
        }
    };

    makeMove(move, playerNr) {
        const pawnObj = this.board.obj[move.old.x][move.old.z];

        this.board.pawns[move.old.x][move.old.z] = 0;
        this.board.pawns[move.new.x][move.new.z] = playerNr;
        this.board.obj[move.old.x][move.old.z] = undefined;
        this.board.obj[move.new.x][move.new.z] = pawnObj;
        pawnObj.userData.x = move.new.x;
        pawnObj.userData.z = move.new.z;

        if (playerNr === 1 && move.new.z === this.board.pawns.length - 1) pawnObj.MakeSuper();
        if (playerNr === 2 && move.new.z === 0) pawnObj.MakeSuper();

        if (move.kill) {
            for (const kill of move.kill) {
                this.board.pawns[kill.x][kill.z] = 0;
                this.scene.remove(this.board.obj[kill.x][kill.z]);
            }
        }

        new TWEEN.Tween(pawnObj.position)
            .to({
                x: this.translatePosition(move.new.x),
                z: this.translatePosition(move.new.z)
            })
            .easing(TWEEN.Easing.Quintic.Out)
            .start();

        if (move.changeTurn) {
            this.yourTurn ? this.yourTurn = false : this.yourTurn = true;
            this.killStreak = false;
            toggleWaitingForMove();
        } else {
            resetTimer();
        }
    }
}
