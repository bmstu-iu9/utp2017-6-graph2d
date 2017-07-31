/*Алгоритм построения графика функций от двух переменных.
Алгоритм строит изолинии (линии уровня) графика по заданному Z (значению уровня).*/
'use strict'
function buildPlane() {
	//Обновление canvas и создание context
	space.width = space.width;
	const context = space.getContext('2d');
	
	//Границы построение функции по X, Y, Z (Z = F(X, Y)) соответственно
	const ax = Number(val_ax.value), bx = Number(val_bx.value), ay = Number(val_ay.value), by = Number(val_by.value), az = Number(val_az.value), bz = Number(val_bz.value);
	//Шаг построения по X, Y, Z соответственновенно
	const hx = Number(val_hx.value), hy = Number(val_hy.value), st = Number(val_st.value);
	//Длина оси Z
	const zmax = Math.abs(bz-az);
	//Строка в которой записана функция от x, y
	const func = val_func.value;
	//Функция от (x, y) возвращающая значение F(x, y) где F наша функция
	const F = (x, y) => {
		return eval(func);
	};
	
	//Функция получающая координату X функции и возвращающая координату X в Canvas
	const GraphX = (x) => {
		/*Требуется написать*/
	};
	//Функция получающая координату Y функции и возвращающая координату Y в Canvas
	const GraphY = (y) => {
		/*Требуется написать*/
	};
	
	/*Кусок кода отвечающий за построение координатных осей*/
	//Функция получающая на вход значение уровня и возвращающая его цвет в формате 'rgb(r, g, b)'
	const RGB = (z) => {
		/*Требуется написать*/
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
	//Идет по Y
	for (y = ay; y <= by; y += hy) {
		yg = GraphY(y, ky, ky0);
		x = ax;
		k0 = Interval(F(x, y));
		for (x = ax+hx; x <= bx; x += hx) {
			k = Interval(F(x, y));
			if (k != k0) {
				Color = Level(k0, k);
				xg = GraphX(x - hx/2, kx, kx0);
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
};
