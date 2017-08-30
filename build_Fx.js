'use strict'

function error(e) {
    alert(e + '\nresult can be incorret')
}

//command.js

class TCommand {

    constructor(expr, min, max, pointsSize) {
        this.expr = expr
        this.i = 0
        this.min = min
        this.max = max
        this.stack = new TStack(min, max, pointsSize)
        this.commands = []
        this.parseExpr() 
        this.run()
	}


    getFieldData() {
        return this.stack.getData()
    }

    run() {
        while (this.commands.length > 0) {
            let cmd = this.commands.pop()
            cmd.updateStack(this.stack)
        }
    }

    getChar() {
        this.i++
    }

    EOF() {
        return (this.i < this.expr.length)
    }

    parseExpr() {
        while (this.EOF()) {
            if (this.expr[this.i] == 'x') {
                this.commands.push(new TVarible())
                return
            } else if (this.expr[this.i] == '[') {
                this.parseNumber()
                return
            } else if (this.expr[this.i] <= 'z' && this.expr[this.i] >= 'a') {
                this.parseFunction()
                return
            } else if (this.expr[this.i] != ' ' && this.expr[this.i] != '\n' && this.expr[this.i] != '\t') {
                error('Incorret syntax : not expected space')
                return
            } else {
				error('Incorret syntax : not expected ' + this.expr[this.i])
			}
            this.getChar()
        }
    }

    parseFunction() {
        let name = ''
        while (this.EOF() && this.expr[this.i] != '(') {
            name += this.expr[this.i]
            this.getChar()
        }
        this.commands.push(new TFunction(name))

        this.getChar()
		
		if (this.expr[this.i] == ')') {
			return		
		}
		
        this.parseExpr()
        this.getChar()
        if (this.expr[this.i] == ',') {
            this.getChar()
            this.parseExpr()
            this.getChar()
            if (this.expr[this.i] != ')') {
                error('Incorret syntax : expected \')\'')
            }
        } else if (this.expr[this.i] != ')') {
             error('Incorret syntax : expected \')\'')
        }
    }

    parseNumber() {
        this.getChar()
        let value = ''
        while (this.EOF() && this.expr[this.i] != ']') {
            value += this.expr[this.i]
            this.getChar()
        }
        var num = parseFloat(value)
        if (num == NaN) {
             error('Incorret syntax : not expected ' + value)
            return
        }
        this.commands.push(new TNumber(num))
    }
}

//end command.js


//stack.js
class TStack {

    constructor(min, max, pointsSize) {
        this.stack = []

        let step = (max - min) / pointsSize
        let array = []
        for (let i = min; i < max; i += step) {
            array.push(i)
        }
        this.dataX = {
            min: min,
            max: max,
            points: array
        }
    }

    getData() {
        return [this.dataX, this.pop()]
    }

    getDataX() {
        return this.dataX
    }

    setPointsX(points) {
        this.dataX.points = points
    }

    push(data) {
        this.stack.push(data)
    }

    pop() {
        return this.stack.pop()
    }
}
//end stack.js


//intervals.js

class TInterval {
	

    sin(a, b) {
        if (isFinite(a) && isFinite(b)) {
            let data = {
				min: a,
				max: b,
				asymp: []
			}
            return data
        }
        return error('Incorrect interval')
    }


    cos(a, b) {
        if (isFinite(a) && isFinite(b)) {
            let data = {
				min: a,
				max: b,
				asymp: []
			}
            return data
        }
        return error('Incorrect interval')
    }


    tg(a, b) {
        if (isFinite(a) && isFinite(b)) {
			let factorPi = Math.PI/2
			let asymptotes = []
			if (a < 0.0) {
				factorPi *= -1.0;
			}
			let start = Math.floor(a / Math.PI) * Math.PI + factorPi;
			for (let i = start; i <= b; i += Math.PI) {
				if (i >= a && i <= b) {
					asymptotes.push(i)
				}
			}
			
			let data = {
				min: a,
				max: b,
				asymp: asymptotes
			}
            return data
        }
        return error('Incorrect interval')
    }
	
	ctg(a, b) {
        if (isFinite(a) && isFinite(b)) {
			let asymptotes = []
			let start = Math.floor(a / Math.PI) * Math.PI;
			for (let i = start; i <= b; i += Math.PI) {
				if (i >= a && i <= b) {
					asymptotes.push(i)
				}
			}
			
			let data = {
				min: a,
				max: b,
				asymp: asymptotes
			}
            return data
        }
        return error('Incorrect interval')
    }


    logR(a, b) {
        if (isFinite(a) && isFinite(b)) {
            if (b <= 0.0) {
                return error()
            }
			let asymp = []
            if (a <= 0.0) {
                a = 0.0
				asymp.push(0.0)
            }
			
			let data = {
				min: a,
				max: b,
				asymp: asymp
			}

			return data

        }
        return error('Incorrect interval')
    }

	logL(a, b) {
        if (isFinite(a) && isFinite(b)) {
            if (b <= 0.0) {
                return error()
            }

            let asymp = []
            if (a <= 0.0) {
                a = 0.0
				asymp.push(0.0)
            }
			
			if (b >= 1.0) {
				asymp.push(1.0)			
			}
			
			
			let data = {
				min: a,
				max: b,
				asymp: asymp
			}

			return data

        }
        return error('Incorrect interval')
    }


    arcsin(a, b) {
        if (isFinite(a) && isFinite(b)) {
            if (a > 1.0 || b < -1.0) {
                return error()
            }
            if (a < -1.0) {
                a = -1.0
            }
            if (b > 1.0) {
                b = 1.0
            }
            
			let data = {
				min: a,
				max: b,
				asymp: []
			}
            return data
        }
        return error('Incorrect interval')
    }


    arccos(a, b) {
        if (isFinite(a) && isFinite(b)) {
            if (a > 1.0 || b < -1.0) {
                return error()
            }
            if (a < -1.0) {
                a = -1.0
            }
            if (b > 1.0) {
                b = 1.0
            }
            
			let data = {
				min: a,
				max: b,
				asymp: []
			}
            return data
        }
        return error('Incorrect interval')
    }


    arctg(a, b) {
        if (isFinite(a) && isFinite(b)) {
            let data = {
				min: a,
				max: b,
				asymp: []
			}
            return data
        }
        return error('Incorrect interval')
    }
	
	
	arcctg(a, b) {
        if (isFinite(a) && isFinite(b)) {
			let asymp = []
			if (a <= 0 && b >= 0) {
				asymp = [0.0]			
			}
            let data = {
				min: a,
				max: b,
				asymp: asymp
			}
            return data
        }
        return error('Incorrect interval')
    }

    abs(a, b) {
        if (isFinite(a) && isFinite(b)) {
            let data = {
				min: a,
				max: b,
				asymp: []
			}
            return data
        }
        return error('Incorrect interval')
    }


    plus(a, b) {
        if (isFinite(a) && isFinite(b)) {
            let data = {
				min: a,
				max: b,
				asymp: []
			}
            return data
        }
        return error('Incorrect interval')
    }


    minus(a, b) {
        if (isFinite(a) && isFinite(b)) {
            let data = {
				min: a,
				max: b,
				asymp: []
			}
            return data
        }
        return error('Incorrect interval')
    }


    mult(a, b) {
        if (isFinite(a) && isFinite(b)) {
            let data = {
				min: a,
				max: b,
				asymp: []
			}
            return data
        }
        return error('Incorrect interval')
    }

    pow(a, b) { // right and left
        if (isFinite(a) && isFinite(b)) {
            let data = {
				min: a,
				max: b,
				asymp: []
			}
            return data
        }
        return error('Incorrect interval')
    }


    divR(a, b) { //right
        if (isFinite(a) && isFinite(b)) {
            let asymp = []
            if (a <= 0.0 && b >= 0) {
                asymp = [0.0]
            }
			
            let data = {
				min: a,
				max: b,
				asymp: asymp
			}
            return data
        }
        return error('Incorrect interval')
    }

    divL(a, b) { //left
        if (isFinite(a) && isFinite(b)) {
            let data = {
				min: a,
				max: b,
				asymp: []
			}
            return data
        }
        return error('Incorrect interval')
    }

}
//end intervals.js


//functions.js
class TNumber {

    constructor(num) {
        this.num = num
    }

    updateStack(stack) {
        let array = []
        let pointsSize = stack.getDataX().points.length
        for (let i = 0; i < pointsSize; i++) {
            array.push(this.num)
        }
        let data = {
            min: this.num,
            max: this.num,
            points: array,
            asymp: []
        }
        stack.push(data)
    }

}

class TVarible {

    constructor() {}

    updateStack(stack) {
        let data = stack.getDataX()
        data.asymp = []
        stack.push(data)
    }
}

class TFunction {

    constructor(name) {
        this.intervals = new TInterval()
        this.functions = {
            sin: this.sin,
            cos: this.cos,
            tg: this.tg,
            log: this.log,
            arcsin: this.arcsin,
            arccos: this.arccos,
            arctg: this.arctg,
            abs: this.abs,
            pow: this.pow,
            plus: this.plus,
            minus: this.minus,
            mult: this.mult,
            div: this.div,
            e: this.E,
            pi: this.PI,
			ctg : this.ctg,
			arcctg : this.arcctg
        }
        this.func = this.functions[name]
		if (this.func == undefined) {
			error('Incorrect function name : ' + name)		
		}
    }


    updateStack(stack) {
        let info = this.func()

        let args = []
        let argsInfo = []

        for (let i = 0; i < info.argSize; i++) {
            let arg = stack.pop()
            if (arg == undefined) {
                error('Incorrect expression')
                return;
            }
            let argInfo = info.interval[i](arg.min, arg.max)
            if (argInfo.asymp.length > 0) {
                let newPoints = this.addAsymptotes(stack.getDataX().points, arg.points, argInfo.asymp)
                stack.setPointsX(newPoints[0])
                arg.points = newPoints[1]
            }
            argsInfo.push(argInfo)
            args.push(arg)
        }

        let pointsY = []

        let size = stack.getDataX().points.length

        let dataOut = {}

        if (info.argSize == 0) {
			let num = info.fx()
            for (let i = 0; i < size; i++) {
                pointsY.push(num)
            }

            dataOut.min = num
            dataOut.max = num
            dataOut.points = pointsY

        } else {
            let minY = +Infinity
            let maxY = -Infinity
            for (let i = 0; i < size; i++) {
                let arrX = []
                for (let j = 0; j < info.argSize; j++) {
                    let x = args[j].points[i]
                    if (x != undefined && x >= argsInfo[j].min && x <= argsInfo[j].max) {
                        arrX.push(x)
                    }
                }
                if (arrX.length == info.argSize) {
                    let y
                    if (info.argSize == 1) {
                        y = info.fx(arrX[0])
                    } else if (info.argSize == 2) {
                        y = info.fx(arrX[0], arrX[1])
                    }
                    pointsY.push(y)
                    if (y < minY) {
                        minY = y
                    }
                    if (y > maxY) {
                        maxY = y
                    }
                } else {
                    pointsY.push(undefined)
                }
            }
            dataOut.min = minY
            dataOut.max = maxY
            dataOut.points = pointsY
        }

        stack.push(dataOut)
    }

    addAsymptotes(arrayX, arrayY, asymp) {
        let newArrayX = []
        let newArrayY = []
        for (let i = 0; i < asymp.length; i++) {
			let j = 0
			let size = arrayX.length
            for (; j < size - 1; j++) {
                let y1 = arrayY[j]
                let y2 = arrayY[j + 1]
                if (y1 != undefined && y2 != undefined &&
                    ((y1 > asymp[i] && y2 < asymp[i]) ||
                        (y1 < asymp[i] && y2 > asymp[i]))) {
                    let x1 = arrayX[j]
                    let x2 = arrayX[j + 1]
                    let newX = x1 + (x2 - x1) / 2
                    newArrayX.push(x1)
                    newArrayY.push(y1)
                    newArrayX.push(newX)
                    newArrayY.push(undefined)
                } else if (y1 != undefined && y1 == asymp[i]) {
                    newArrayX.push(arrayX[j])
                    newArrayY.push(undefined)
                } else if (y2 != undefined && y2 == asymp[i]) {
                    newArrayX.push(arrayX[j])
                    newArrayY.push(y1)
                    newArrayX.push(arrayX[j + 1])
                    newArrayY.push(undefined)
                    j++
                } else {
                	newArrayX.push(arrayX[j])
                	newArrayY.push(y1)
				}
            }
			if (j == size - 1) {
				newArrayX.push(arrayX[j])
				newArrayY.push(arrayY[j]) 		
			}
			arrayX = newArrayX
			arrayY = newArrayY
			newArrayX = []
			newArrayY = []
			
        }
		
        return [arrayX, arrayY]
    }

    sin() {
        let info = {
            fx: Math.sin,
            argSize: 1,
            interval: [this.intervals.sin]
        }

        return info
    }


    cos() {
        let info = {
            fx: Math.cos,
            argSize: 1,
            interval: [this.intervals.cos]
        }

        return info
    }



    tg() {
        let info = {
            fx: Math.tan,
            argSize: 1,
            interval: [this.intervals.tg]
        }

        return info
    }
	
	ctg() {
		let info = {
            fx: function (x) {
				return 1/Math.tan(x)
			},
            argSize: 1,
            interval: [this.intervals.ctg]
        }

        return info
	}


    arcsin() {
        let info = {
            fx: Math.asin,
            argSize: 1,
            interval: [this.intervals.arcsin]
        }

        return info
    }


    arccos() {
        let info = {
            fx: Math.acos,
            argSize: 1,
            interval: [this.intervals.arccos]
        }

        return info
    }


    arctg() {
        let info = {
            fx: Math.atan,
            argSize: 1,
            interval: [this.intervals.arctg]
        }

        return info
    }
	
	arcctg() {
        let info = {
            fx: function (x) {
				return Math.atan(1/x)
			},
            argSize: 1,
            interval: [this.intervals.arcctg]
        }

        return info
    }


    log() {
        let info = {
            fx: function (a, b) {
				return Math.log(b) / Math.log(a)
			},
            argSize: 2,
            interval: [this.intervals.logL, this.intervals.logR]
        }
        return info
    }


    abs() {
        let info = {
            fx: Math.abs,
            argSize: 1,
            interval: [this.intervals.abs]
        }

        return info
    }


    pow() {
        let info = {
            fx: Math.pow,
            argSize: 2,
            interval: [this.intervals.pow, this.intervals.pow]
        }

        return info
    }


    plus() {

        let info = {
            fx: function(a, b) {
                return a + b
            },
            argSize: 2,
            interval: [this.intervals.plus, this.intervals.plus]
        }

        return info
    }


    minus() {

        let info = {
            fx: function(a, b) {
                return a - b
            },
            argSize: 2,
            interval: [this.intervals.minus, this.intervals.minus]
        }

        return info
    }

    mult() {

        let info = {
            fx: function(a, b) {
                return a * b
            },
            argSize: 2,
            interval: [this.intervals.mult, this.intervals.mult]
        }

        return info
    }


    div() {

        let info = {
            fx: function(a, b) {
                return a / b
            },
            argSize: 2,
            interval: [this.intervals.divL, this.intervals.divR]
        }

        return info
    }

    PI() {
        let info = {
            fx: function() {
                return Math.PI
            },
            argSize: 0,
            interval: []
        }

        return info
    }

    E() {
        let info = {
            fx: function() {
                return Math.E
            },
            argSize: 0,
            interval: []
        }

        return info
    }
}
//end functions.js

function build_Fx() {
	space_fx.width = space_fx.width
	space_fx.height = space_fx.height
    const context = space_fx.getContext('2d')

    const screen = {
    	deltaWidth: 200,
    	deltaHeight: 200,
    	width: space_fx.width - 200,
    	height: space_fx.height - 200,
    	deltaAxis: 10
    };
	
    const start = Number(val_start.value), stop = Number(val_stop.value)
    const expr = val_fx.value
	
	if (start >= stop) {
		error('Incorrect intervals')
	}

    let cmd = new TCommand(expr, start, stop, screen.width)
    let data = cmd.getFieldData()
	
	
    let dataX = {
        min: data[0].min,
        max: data[0].max,
        points: data[0].points
    };


	dataX.delta = (dataX.max - dataX.min) / screen.width
    dataX.scale = (screen.width) / (dataX.max - dataX.min)
    dataX.center = (screen.width + screen.deltaWidth) / 2 - (dataX.min + (dataX.max - dataX.min) / 2) * dataX.scale
	
    let dataY = {
        min: data[1].min,
        max: data[1].max,
        points: data[1].points
    };
	
	if (dataY.min == dataY.max) {
		dataY.min = dataY.min - screen.height/2
		dataY.max = dataY.max + screen.height/2
	} else {
		let newMin = +Infinity
		let newMax = -Infinity
		for (let i = 0; i < dataY.points.length; i++) {
			let y = dataY.points[i]
			if (y == dataY.min || y == dataY.max) {
				dataY.points[i] = undefined
			} else if (y != undefined && y < newMin) {
				newMin = y
			} else if (y != undefined && y > newMax) {
				newMax = y
			}
		}
		dataY.min = newMin
		dataY.max = newMax
	}
	
    dataY.delta = (dataY.max - dataY.min) / screen.height;
    dataY.scale = (screen.height) / (dataY.max - dataY.min);
    dataY.center = (screen.height + screen.deltaHeight) / 2 + (dataY.min + (dataY.max - dataY.min) / 2) * dataY.scale;

    function drawOx() {
        let yConst = screen.deltaHeight / 4;
        context.moveTo(screen.deltaWidth / 4 - screen.deltaAxis, yConst);
        context.lineTo(screen.width + 3 * screen.deltaWidth / 4 + screen.deltaAxis, yConst);
        context.strokeStyle = "black"
        for (let j = 0; j <= (screen.width + screen.deltaWidth / 2); j += screen.deltaWidth / 2) {
            context.moveTo(screen.deltaWidth / 2 + j, yConst - screen.deltaAxis);
            context.lineTo(screen.deltaWidth / 2 + j, yConst + screen.deltaAxis);
            let num = (dataX.min + j * dataX.delta).toExponential(2);
            context.font = "10px Arial";
            context.fillStyle = "black";
            context.fillText(num, screen.deltaWidth / 2 + j + screen.deltaAxis, yConst - screen.deltaAxis);
        }
    }

    function drawOy() {
        let xConst = screen.deltaWidth / 4;
        context.moveTo(xConst, screen.deltaHeight / 4 - screen.deltaAxis);
        context.lineTo(xConst, screen.height + 3 * screen.deltaHeight / 4 + screen.deltaAxis);
        context.strokeStyle = "black"
        for (let j = 0; j <= (screen.height + screen.deltaHeight / 2); j += screen.deltaHeight / 2) {
            context.moveTo(xConst - screen.deltaAxis, screen.deltaHeight / 2 + j);
            context.lineTo(xConst + screen.deltaAxis, screen.deltaHeight / 2 + j);
            let num = (dataY.max - j * dataY.delta).toExponential(2);
            context.font = "10px Arial";
            context.fillStyle = "black";
            context.fillText(num, xConst + screen.deltaAxis, screen.deltaHeight / 2 + j - screen.deltaAxis);
        }
    }

    context.beginPath();

    drawOx()
    drawOy()
	
    let x, y
    let isDraw = false

    for (let i = 0; i < dataX.points.length; i++) {
        x = dataX.points[i]
        y = dataY.points[i]
        if (y != undefined) {
            if (!isDraw) {
                context.moveTo(dataX.center + x * dataX.scale, dataY.center - y * dataY.scale);
                isDraw = true
            }
            context.lineTo(dataX.center + x * dataX.scale, dataY.center - y * dataY.scale);
        } else {
            isDraw = false
        }
    }
    context.stroke();
}
