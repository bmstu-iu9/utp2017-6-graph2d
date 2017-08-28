/*Алгоритм построения графика функций от двух переменных.
Алгоритм строит график в пространстве*/
'use strict'
function buildPlane() {
	//Обновление canvas и создание context
	space.width = space.width;
	const context = space.getContext('2d');
	
	//Границы построение функции по X, Y, Z (Z = F(X, Y)) соответственно
	const ax = Number(val_ax.value), bx = Number(val_bx.value), ay = Number(val_ay.value), by = Number(val_by.value), az = Number(val_az.value), bz = Number(val_bz.value);
	//Шаг построения по X, Y соответственновенно
	const hx = Number(val_hx.value), hy = Number(val_hy.value);
	//Длина оси Z
	const zmax = Math.abs(bz-az), xmax = Math.abs(bx-ax), ymax = Math.abs(by-ay);
	//Строка в которой записана функция от x, y
	const func = val_func.value;
	//Функция от (x, y) возвращающая значение F(x, y) где F наша функция
	const F = (x, y) => {
		return eval(func);
	};
	//Автоматический выбор шага
	if (hx == 0) {
		hx = Math.abs(bx-ax)/500;
	};
	if (hy == 0) {
		hy = Math.abs(by-ay)/500;
	};
	//Функция возвращающая цвет для данного уровня (пока не используется)
	const RGB = (z) => {
		let r, g, b;
		if (z < (zmax / 2)) {
			r = 0;
			g = Math.round((255 * 2 * z) / zmax);
			b = Math.round(255 - (255 * 2 * z) / zmax);
		} else {
			r = Math.round((255 * 2 * z) / zmax - 255);
			g = Math.round(255 * 2 - (255 * 2 * z) / zmax);
			b = 0;
		};
		return ('rgb(' + r + ', ' + g + ', ' + b + ')');
	};
	
	//Вспомогательные переменные
	const PI = Math.PI;
	const maxX = space.width-70;
	const maxY = space.height-50;
	const kx = 7, ky = 4.5;
	const R0 = maxX/(kx*Math.cos(10*PI/180)+ky*Math.cos(30*PI/180));
	const yd = kx*R0*Math.sin(10*PI/180), yu = ky*R0*Math.sin(30*PI/180);
	//Функция преобразующая координаты x, y, z пространства в координаты xc, yc плоскости canvas
	const GraphToCanvas = (x, y, z) => {
		let xc = 40, yc = 0;
		
		yc += yd+(z-az)*(maxY-yd-yu)/zmax;
		
		yc += (y-ay)*yu/ymax;
		xc += (y-ay)*(ky*R0*Math.cos(30*PI/180))/ymax;
		
		yc -= (x-ax)*yd/xmax;
		xc += (x-ax)*(kx*R0*Math.cos(10*PI/180))/xmax;
		
		yc = maxY-yc;
		
		return [xc, yc];
	};
	//Вспомогательные переменные
	let x, xg, y, yg, z, helparr, i, j;
	//Число отвечающее за шаг координатной сетки
	const N = 5;
	
	//Построение осей координат
	helparr = GraphToCanvas(ax, ay, az);
	x = helparr[0];
	y = helparr[1]+20;
	context.moveTo(x, y);
	
	helparr = GraphToCanvas(ax, ay, bz);
	context.lineTo(helparr[0], helparr[1]);
	context.moveTo(x, y);
	
	helparr = GraphToCanvas(bx, ay, az);
	context.lineTo(helparr[0], helparr[1]+20);
	
	helparr = GraphToCanvas(bx, by, az);
	context.lineTo(helparr[0], helparr[1]+20);
	
	helparr = GraphToCanvas(ax, by, az);
	context.lineTo(helparr[0], helparr[1]+20);
	context.closePath();
	
	context.strokeStyle = "#000";
	context.stroke();
	
	//Разметка оси Z
	context.beginPath();
	context.textAlign = 'left';
	context.setLineDash([3]);
	context.fillStyle = "#000";
	for (i = 0; i <= N; i++) {
		z = az + i*zmax/N;
		helparr = GraphToCanvas(ax, ay, z);
		context.moveTo(helparr[0], helparr[1]);
		context.fillText(z.toExponential(), helparr[0]-37, helparr[1]+5)
		
		helparr = GraphToCanvas(ax, by, z);
		context.lineTo(helparr[0], helparr[1]);
		
		helparr = GraphToCanvas(bx, by, z);
		context.lineTo(helparr[0], helparr[1]);
	};
	//Разметка осей X и Y
	for (i = 0; i <= N; i++) {
		x = ax + i*xmax/N;
		helparr = GraphToCanvas(x, ay, az);
		context.moveTo(helparr[0], helparr[1]+20);
		context.fillText(x.toExponential(), helparr[0]-30, helparr[1]+35);
		
		helparr = GraphToCanvas(x, by, az);
		context.lineTo(helparr[0], helparr[1]+20);
		
		y = ay + i*ymax/N;
		helparr = GraphToCanvas(bx, y, az);
		context.moveTo(helparr[0], helparr[1]+20);
		context.fillText(y.toExponential(), helparr[0]+5, helparr[1]+30);
		
		helparr = GraphToCanvas(ax, y, az);
		context.lineTo(helparr[0], helparr[1]+20);
	};
	context.strokeStyle = "#5f5f5f";
	context.stroke();
	
	context.beginPath();
	
	context.setLineDash([0]);
	//Максимальное число точек на оси (по X и Y соответственно)
	const nx = Math.ceil(xmax/hx)+1, ny = Math.ceil(ymax/hy)+1;
	//Массив для хранения точек графика
	let arrPoint = [];
	arrPoint.length = ny;
	for (i = 0; i < ny; i++) {
		arrPoint[i] = [];
		arrPoint[i].length = nx;
	};
	//Заполнение массива
	i = 0;
	j = 0;
	for (y = by; y >= ay; y -= hy) {
		for (x = ax; x <= bx; x += hx) {
			z = F(x, y);
			if (z < az || z > bz || !isFinite(z)) {
				arrPoint[i][j] = null;
			} else {
				arrPoint[i][j] = GraphToCanvas(x, y, z);
			};
			j++;
		};
		j = 0;
		i++;
	};
	
	//Основной алгоритм построения графика
	context.lineWidth = 0.5;
	context.fillStyle = "#ffffff";
	let A, B, C, D;
	for (i = 1; i < ny; i++) {
		for (j = 1; j < nx; j++) {
			A = arrPoint[i-1][j-1];
			B = arrPoint[i-1][j];
			C = arrPoint[i][j];
			D = arrPoint[i][j-1];
			if (B != null && C != null) {
				if (A == null) {
					if (D == null) {
						//context.beginPath();
						//context.moveTo(B[0], B[1]);
						//context.lineTo(C[0], C[1]);
						//context.strokeStyle = "#5A009D";
						//context.stroke();
						continue;
					} else {
						context.beginPath();
						context.moveTo(B[0], B[1]);
						context.lineTo(C[0], C[1]);
						context.lineTo(D[0], D[1]);
						context.closePath();
						context.fill();
						context.strokeStyle = "#5A009D";
						context.stroke();
						continue;
					};
				} else {
					if (D == null) {
						context.beginPath();
						context.moveTo(A[0], A[1]);
						context.lineTo(B[0], B[1]);
						context.lineTo(C[0], C[1]);
						context.closePath();
						context.fill();
						context.strokeStyle = "#5A009D";
						context.stroke();
						continue;
					} else {
						context.beginPath();
						context.moveTo(A[0], A[1]);
						context.lineTo(B[0], B[1]);
						context.lineTo(C[0], C[1]);
						context.lineTo(D[0], D[1]);
						context.closePath();
						context.fill();
						context.strokeStyle = "#5A009D";
						context.stroke();
						continue;
					};
				};
			};
			if (A != null && D != null && (B != null || C != null)) {
				if (B != null) {
					context.beginPath();
					context.moveTo(A[0], A[1]);
					context.lineTo(B[0], B[1]);
					context.lineTo(D[0], D[1]);
					context.closePath();
					context.fill();
					context.strokeStyle = "#5A009D";
					context.stroke();
					continue;
				};
				if (C != null) {
					context.beginPath();
					context.moveTo(A[0], A[1]);
					context.lineTo(C[0], C[1]);
					context.lineTo(D[0], D[1]);
					context.closePath();
					context.fill();
					context.strokeStyle = "#5A009D";
					context.stroke();
					continue;
				};
			};
		};
	};
};
