

        // NAVEGACION ENTRE SECCIONES

        const navLinks = document.querySelectorAll('.nav-link');

        const pages = document.querySelectorAll('.page');

        navLinks.forEach(link => {

            link.addEventListener('click', () => {

                const target = link.dataset.page;

                navLinks.forEach(item => {
                    item.classList.remove('active');
                });

                pages.forEach(page => {
                    page.classList.remove('active');
                });

                link.classList.add('active');

                document.getElementById(target).classList.add('active');

            });

        });


        // ESTADISTICAS ORIGINALES
        // Esto pregunta cada 1 segundo: "oye, ¿cuánto hay ahora?"

        setInterval(async () => {

            try {

                let res = await fetch('/stats');

                let data = await res.json();

                // Mantener identificadores originales

                document.getElementById('person').innerText = data['person'] || 0;

                document.getElementById('car').innerText = data['car'] || 0;

                document.getElementById('cell phone').innerText = data['cell phone'] || 0;

                let otros = 0;

                for (let k in data) {

                    if (k != 'person' && k != 'car' && k != 'cell phone') {
                        otros += Number(data[k]) || 0;
                    }

                }

                document.getElementById('otros').innerText = otros;


                // DATOS PARA LAS NUEVAS SECCIONES

                const person = Number(data['person']) || 0;

                const car = Number(data['car']) || 0;

                const cell = Number(data['cell phone']) || 0;

                const total = person + car + cell + otros;

                // Actualizar deteccion en vivo

                document.getElementById('live-person').innerText = person;

                document.getElementById('live-car').innerText = car;

                document.getElementById('live-cell').innerText = cell;

                document.getElementById('live-otros').innerText = otros;


                // Actualizar estadisticas

                document.getElementById('total-objects').innerText = total;

                document.getElementById('category-count').innerText =
                    [person, car, cell, otros].filter(v => v > 0).length;

                document.getElementById('stats-person').innerText = person;

                document.getElementById('stats-car').innerText = car;


                // Actualizar barras de graficos

                const max = Math.max(person, car, cell, otros, 1);

                function updateBar(id, valueId, value) {

                    document.getElementById(id).style.width =
                        (value / max * 100) + '%';

                    document.getElementById(valueId).innerText = value;

                }

                updateBar('bar-person', 'bar-person-value', person);

                updateBar('bar-car', 'bar-car-value', car);

                updateBar('bar-cell', 'bar-cell-value', cell);

                updateBar('bar-other', 'bar-other-value', otros);


                // Actualizar resumen

                document.getElementById('summary-person').innerText = person;

                document.getElementById('summary-car').innerText = car;
                document.getElementById('summary-cell').innerText = cell;
            } catch (error) {
                console.error('Error fetching stats:', error);
            }
        }, 1000);