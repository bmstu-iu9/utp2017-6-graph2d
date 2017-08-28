/*Алгоритм построения графика функций от двух переменных.
Алгоритм строит изолинии (линии уровня) графика по заданному Z (значению уровня).*/
'use strict'
function buildPlanePixel() {
	//Обновление canvas и создание context
	space.width = space.width;
	const context = space.getContext('2d');
	
	//Границы построение функции по X, Y, Z (Z = F(X, Y)) соответственно
	const ax = Number(val_ax.value), bx = Number(val_bx.value), ay = Number(val_ay.value), by = Number(val_by.value), az = Number(val_az.value), bz = Number(val_bz.value);
	//Шаг построения по X, Y, Z соответственновенно
	//При значении равным 0 шаг будет выбран автоматически
	let hx = Number(val_hx.value), hy = Number(val_hy.value), st = Number(val_st.value);
	//Позволяет автоматически выбирать значения hx, hy, st
	if (hx == 0) {
		hx = Math.abs(bx-ax)/500;
	};
	if (hy == 0) {
		hy = Math.abs(by-ay)/500;
	};
	if (st == 0) {
		st = Math.abs(bz-az)/15;
	};
	//Длина оси Z
	const zmax = Math.abs(bz-az);
	//Строка в которой записана функция от x, y
	const func = val_func.value;
	//Функция от (x, y) возвращающая значение F(x, y) где F наша функция
	const F = (x, y) => {
		return eval(func);
	};
	
	// Координаты в Canvas
	const maxX = space.width - 30;
	const maxY = space.height - 30;
	const R0 = maxX / maxY;
	const w = Math.abs(bx - ax);
	const h = Math.abs(by - ay);
	let kx, kx0, ky, ky0;
	if ((w / h) < R0) {
		kx = maxX / (h * R0);
		kx0 = -kx * (ax + bx - h * R0) / 2;
		ky = - maxY / h;
		ky0 = -ky * by;
	} else {
		kx = maxX / w;
		kx0 = -kx * ax;
		ky = -maxY * R0 / w;
		ky0 = -ky * (ay + by + w / R0) / 2;
	};
	kx0 += 20;
	ky0 += 10;
	//Функция получающая координату X функции и возвращающая координату X в Canvas
	const GraphX = (x) => {
		return Math.round(x * kx + kx0 + 0.5);
	};
	//Функция получающая координату Y функции и возвращающая координату Y в Canvas
	const GraphY = (y) => {
		return Math.round(y * ky + ky0 + 0.5);
	};
	
	// Построение координатных осей
	context.lineWidth = 1.5;
	context.moveTo(GraphX(ax), GraphY(ay));
	context.lineTo(GraphX(bx), GraphY(ay));
	context.moveTo(GraphX(ax), GraphY(ay));
	context.lineTo(GraphX(ax), GraphY(by));
	context.strokeStyle = "#000";
	context.stroke();
	
	
	context.beginPath();
	context.lineWidth = 0.5;
	context.textAlign = 'left';
	context.setLineDash([3]);
	context.fillStyle = "#000";
	const Q = 5;
	let xc, yc;
	for (let a = 0; a <= Q; a++) {
		yc = ay+a*(by-ay)/Q;
		context.fillText(Math.round(yc).toString(10), 0, GraphY(yc) + 2);
		context.moveTo(GraphX(ax), GraphY(yc));
		context.lineTo(GraphX(bx), GraphY(yc));
	};
	context.strokeStyle = "#5f5f5f";
	context.stroke();
	
	context.beginPath();
	context.textAlign = 'center';
	for (let a = 0; a <= Q; a++) {
		xc = ax + a * (bx - ax) / Q
		context.fillText(Math.round(xc).toString(10), GraphX(xc), maxY + 25);
		context.moveTo(GraphX(xc), GraphY(ay));
		context.lineTo(GraphX(xc), GraphY(by));
	};
	context.strokeStyle = "#5f5f5f";
	context.stroke();
	context.setLineDash([0]);
	
	// Цвета в RGB
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
	
	//Вспомогательная функция
	function Interval(z) {
		let i;
		for (i = 0; i <= Math.floor((bz-az)/st); i++) {
			if (z < i*st+az) {
				return i;
			};
		};
		return i;
	};
	//Функция возвращающая номер уровня
	function Level(k0, k) {
		return k > k0? k-1 : k;
	};
	//Вспомогательные переменные
	let x, xg, y, yg, Color, k0, k;
	//Основные алгоритмы потроения графика
	context.beginPath();
	//Идет по Y
	for (y = ay; y <= by; y += hy) {
		yg = GraphY(y);
		x = ax;
		k0 = Interval(F(x, y));
		for (x = ax+hx; x <= bx; x += hx) {
			k = Interval(F(x, y));
			if (k != k0) {
				Color = Level(k0, k);
				xg = GraphX(x - hx/2);
				context.fillStyle = RGB(Color*st+az);
				context.fillRect(xg, yg, 1, 1);
				k0 = k;
			};
		};
	};
	//Идет по X
	for (x = ax; x <= bx; x += hx) {
		xg = GraphX(x);
		y = ay;
		k0 = Interval(F(x, y));
		for (y = ay+hy; y <= by; y += hy) {
			k = Interval(F(x, y));
			if (k != k0) {
				Color = Level(k0, k);
				yg = GraphY(y - hy/2);
				context.fillStyle = RGB(Color*st+az);
				context.fillRect(xg, yg, 1, 1);
				k0 = k;
			};
		};
	};
	
	//Прорисовка градиента
	let i;
	for (i = 0.5; i < 100; i += 2) {
		context.fillStyle = RGB(i*zmax/100+az);
		context.fillRect(maxX, maxY - i, 20, 1);
	};
	context.fillStyle = "#000";
	context.font = "bold 10px sans-serif";
	context.textBaseline = "middle";
	context.fillText("min", maxX+10, maxY+6);
	context.fillText("max", maxX+10, maxY-104);
};
