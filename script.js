(function () {
    var _a;
    const $ = (query) => document.querySelector(query);
    function getTimeInterval(mil) {
        const minutes = Math.floor(mil / 60000);
        const seconds = Math.floor((mil % 60000) / 1000);
        return `${minutes}m e ${seconds}s`;
    }
    function parkingLot() {
        function read() {
            return localStorage.parkingLot ? JSON.parse(localStorage.parkingLot) : [];
        }
        function add(vehicle, saveInStorage) {
            var _a, _b;
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${vehicle.name}</td>
                <td>${vehicle.licensePlate}</td>
                <td>${vehicle.arrival}</td>
                <td>
                    <button class="delete" data-licenseplate="${vehicle.licensePlate}">X</button>
                </td>
            `;
            (_a = row.querySelector('.delete')) === null || _a === void 0 ? void 0 : _a.addEventListener('click', function () {
                remove(this.dataset.licenseplate);
            });
            (_b = $('#parking-lot')) === null || _b === void 0 ? void 0 : _b.appendChild(row);
            if (saveInStorage) {
                save([...read(), vehicle]);
            }
        }
        function remove(licensePlate) {
            const { arrival, name } = read().find((vehicle) => vehicle.licensePlate === licensePlate);
            const timeInterval = new Date().getTime() - new Date(arrival).getTime();
            const timeString = getTimeInterval(timeInterval);
            if (!confirm(`O veículo ${name} está estacionado a ${timeString}. Deseja sair?`)) {
                return;
            }
            save(read().filter((vehicle) => vehicle.licensePlate !== licensePlate));
            render();
        }
        function save(vehicles) {
            localStorage.setItem('parkingLot', JSON.stringify(vehicles));
        }
        function render() {
            $('#parking-lot').innerHTML = "";
            const vehicles = read();
            if (vehicles.length) {
                vehicles.forEach((vehicle) => add(vehicle));
            }
        }
        return { read, add, remove, save, render };
    }
    parkingLot().render();
    (_a = $('#register')) === null || _a === void 0 ? void 0 : _a.addEventListener('click', () => {
        var _a, _b;
        const name = (_a = $('#name')) === null || _a === void 0 ? void 0 : _a.value;
        const licensePlate = (_b = $('#license-plate')) === null || _b === void 0 ? void 0 : _b.value;
        if (!name || !licensePlate) {
            alert('Os campos de nome e placa são obrigatórios.');
            return;
        }
        parkingLot().add({ name, licensePlate, arrival: new Date().toISOString() }, true);
    });
})();
