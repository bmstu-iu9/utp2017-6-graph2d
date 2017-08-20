/*Алгоритм построения графика функций от двух переменных.
Алгоритм строит изолинии (линии уровня) графика по заданному Z (значению уровня).*/
'use strict'
function buildPlaneDerivative() {
	//Обновление canvas и создание context
	space.width = space.width;
	const context = space.getContext('2d');
	
	//Границы построение функции по X, Y, Z (Z = F(X, Y)) соответственно
	const ax = Number(val_ax.value), bx = Number(val_bx.value), ay = Number(val_ay.value), by = Number(val_by.value), az = Number(val_az.value), bz = Number(val_bz.value);
	//Эпсилон для нужной точности и длина шага
	const Eps = Number(val_Eps.value), L = Number(val_L.value);
	//Шаг построения по Z
	let st = Number(val_st.value);
	//Выбор автоматического значения
	if (st == 0) {
		st = Math.abs(bz-az)/15;
		//Пользователь может выбрать только одну изолинию.
		if (st == 0) {
			st = 1;
		};
	};
	//Длина осей X, Y, Z соответсвенно
	const xmax = Math.abs(bx-ax), ymax = Math.abs(by-ay), zmax = Math.abs(bz-az);
	//Строка в которой записана функция от x, y
	const func = val_func.value;
	//Функция от (x, y) возвращающая значение F(x, y) где F наша функция
	const F = (x, y) => {
		return eval(func);
	};
	// Разностные производные по X и по Y
	
	const hX = 0.001;
	const hY = 0.001;

	//Функция частной производной по X

	const GradX = (x, y) => {
		return ((-F(x + 2 * hX, y) + 8 * F(x + hX, y) - 8 * F(x - hX, y) + F(x - 2 * hX, y)) / (12 * hX));
	};

	//Функция частной производной по Y

	const GradY = (x, y) => {
		return ((-F(x, y + 2 * hY) + 8 * F(x, y + hY) - 8 * F(x, y - hY) + F(x, y - 2 * hY)) / (12 * hY));
	};
	
	// Координаты в Canvas
	const maxX = space.width;
	const maxY = space.height;
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
	
	//Функция получающая координату X функции и возвращающая координату X в Canvas
	const GraphX = (x) => {
		return Math.round(x * kx + kx0 + 0.5);
	};
	//Функция получающая координату Y функции и возвращающая координату Y в Canvas
	const GraphY = (y) => {
		return Math.round(y * ky + ky0 + 0.5);
	};
	
	// Построение координатных осей
	for (let a = ax; a < (bx + 1); a += 1) {
		context.moveTo(GraphX(a), GraphY(ay));
		context.lineTo(GraphX(a), GraphY(by));
	}
	for (let a = ay; a < (by + 1); a += 1) {
		context.moveTo(GraphX(ax), GraphY(a));
		context.lineTo(GraphX(bx), GraphY(a));
	}
	context.strokeStyle = "#eee";
	context.stroke();
	
	context.beginPath();
	context.moveTo(GraphX(0), GraphY(0));
	context.lineTo(GraphX(bx), GraphY(0));
	context.moveTo(GraphX(0), GraphY(0));
	context.lineTo(GraphX(0), GraphY(by));
	context.strokeStyle = "#000";
	context.stroke();
	
	//Функция, которая делает "шаг" вдоль касательной от заданной точки
	//Вход: Координаты точки, длина шага, направление обхода.
	//Выход: Координты точки.
	const Step = (x0, y0, L, R) => {
		const Fx = GradX(x0, y0), Fy = GradY(x0, y0);
		const G = Math.sqrt(Fx**2+Fy**2);
		return [x0+R*L*Fy/G, y0-R*L*Fx/G];
	};
	//Вычесляет длину между двумя точками
	const Length = (x1, y1, x2, y2) => {
		return Math.sqrt((x2-x1)**2+(y2-y1)**2);
	};
	//Поиск ближайшей к (x, y) точки с координатами (U, V) удовлетворяющей условию |C-F(U, V)| < Eps;
	//Используется модифицированный метод Ньютона(касательных). Направление обхода вдоль Градиента.
	const Search = (x, y, C, Eps) => {
		let U, V, dF, dF1, G2, x1, y1;
		U = x;
		V = y;
		dF = C-F(U, V);
		while (Math.abs(dF) > Eps) {
			G2 = GradX(U, V)**2+GradY(U, V)**2;
			x1 = U+dF*GradX(U, V)/G2;
			y1 = V+dF*GradY(U, V)/G2;
			dF1 = C-F(x1, y1);
			while (Math.abs(dF1) > Math.abs(dF)){
				x1 = (x1+U)/2;
				y1 = (y1+V)/2;
				dF1 = C - F(x1, y1);
			};
			U = x1;
			V = y1;
			dF = dF1;
		};
		return [U, V];
	};
	//Алгоритм построения изолиний.
	const PaintLineLevel = (x, y, C, Color, ax, bx, ay, by) => {
		context.beginPath();
		let x0, y0, xg0, yg0, x1, y1, xg1, yg1, P, Q, R, i, helpMas;
		helpMas = Search(x, y, C, Eps);
		P = helpMas[0];
		Q = helpMas[1];
	
		x0 = P;
		y0 = Q;
		R = 1;
		i = 1;
		while (true) {
			helpMas = Step(x0, y0, L, R);
			x = helpMas[0];
			y = helpMas[1];
			helpMas = Search(x, y, C, Eps);
			x1 = helpMas[0];
			y1 = helpMas[1];
			xg0 = GraphX(x0);
			yg0 = GraphY(y0);
			context.moveTo(xg0, yg0);
			xg1 = GraphX(x1);
			yg1 = GraphY(y1);
			context.lineTo(xg1, yg1);
			x0 = x1;
			y0 = y1;
			i += 1;
		
			if (x0 > bx+L || x0 < ax-L || y0 > by+L || y0 < ay-L) {
				if (R == -1) {
					break;
				} else {
					R = -1;
					x0 = P;
					y0 = Q;
					i = 1;
				};
			};
			if (R == 1 && i > 3 && Length(x1, y1, P, Q) < 1.5*L) {
				xg0 = GraphX(P);
				yg0 = GraphY(Q);
				context.moveTo(xg0, yg0);
				context.lineTo(xg1, yg1);
				break;
			};
		};
	
		context.strokeStyle = Color;
		context.stroke();
	};
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
	
	/*Алгоритм строит линии уровня по блокам, это не гарантирует 100% результата.
	Чем больше число блоков, тем выше точность построения, но тем ниже скорость.*/
	//Число отвечающее за количество блоков. N^2 -- количество блоков.
	//qt - количество поисковых точек.
	const N = 1;
	const qt = 1;
	let i, ix, iax, ibx, iy, iay, iby, iz, x, y, count;
	for (i = 0; i < qt; i++) {
		for (ix = 0; ix < N; ix++) {
			for (iy = 0; iy < N; iy++) {
				iax = (ix == 0) ? ax+ix*xmax/N : ax+(ix-0.1)*xmax/N;
				ibx = (ix == N-1) ? ax+(ix+1)*xmax/N : ax+(ix+1.1)*xmax/N;
				iay = (iy == 0) ? ay+iy*ymax/N : ay+(iy-0.1)*ymax/N;
				iby = (iy == N-1) ? ay+(iy+1)*ymax/N : ay+(iy+1.1)*ymax/N;
				x = Math.random()*(ibx-iax)+iax;
				y = Math.random()*(iby-iay)+iay;
				for (iz = az; iz <= bz; iz += st) {
					count = 0;
					while (Math.abs(GradX(x, y)) < Eps && Math.abs(GradY(x, y)) < Eps && count < 3) {
						x = Math.random()*(ibx-iax)+iax;
						y = Math.random()*(iby-iay)+iay;
						count++;
					};
					if (count == 3) {
						continue;
					};
					PaintLineLevel(x, y, iz, RGB(iz-az), iax, ibx, iay, iby);
				}
			}
		}
	}
	//Прорисовка градиента
	for (i = 0.5; i < 100; i += 2) {
		context.fillStyle = RGB(i*zmax/100+az);
		context.fillRect(maxX-20, maxY-i-10, 20, 1);
	};
	context.fillStyle = "#000";
	context.font = "bold 10px sans-serif";
	context.textBaseline = "middle";
	context.fillText("min", maxX-20, maxY-4);
	context.fillText("max", maxX-20, maxY-114);
};
