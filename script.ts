interface Vehicle {
    name: string;
    licensePlate: string;
    arrival: Date | string;
}

(function () {
    const $ = (query: string): HTMLInputElement | null =>
        document.querySelector(query);
    
    function getTimeInterval(mil: number) : String {
        const minutes = Math.floor(mil / 60000);
        const seconds = Math.floor((mil % 60000) / 1000);

        return `${minutes}m e ${seconds}s`;
    }

    function parkingLot() {
        function read(): Vehicle[] {
            return localStorage.parkingLot ? JSON.parse(localStorage.parkingLot) : [];
        }

        function add(vehicle: Vehicle, saveInStorage?: boolean) {
            const row = document.createElement('tr');

            row.innerHTML = `
                <td>${vehicle.name}</td>
                <td>${vehicle.licensePlate}</td>
                <td>${vehicle.arrival}</td>
                <td>
                    <button class="delete" data-licenseplate="${vehicle.licensePlate}">X</button>
                </td>
            `;

            row.querySelector('.delete')?.addEventListener('click', function() {
                remove(this.dataset.licenseplate);
            });

            $('#parking-lot')?.appendChild(row);

            if (saveInStorage) {
                save([...read(), vehicle]);
            }
        }

        function remove(licensePlate: string) {
            const { arrival, name } = read().find(
                (vehicle: Vehicle) => vehicle.licensePlate === licensePlate);
            
            const timeInterval = new Date().getTime() - new Date(arrival).getTime();

            const timeString = getTimeInterval(timeInterval);
            if (!confirm(`O veículo ${name} está estacionado a ${timeString}. Deseja sair?`)) {
                return;
            }

            save(read().filter((vehicle: Vehicle) => vehicle.licensePlate !== licensePlate));
            render();
        }

        function save(vehicles: Vehicle[]) {
            localStorage.setItem('parkingLot', JSON.stringify(vehicles));
        }

        function render() {
            $('#parking-lot')!.innerHTML = "";
            const vehicles = read();

            if (vehicles.length) {
                vehicles.forEach((vehicle) => add(vehicle));
            }
        }

        return { read, add, remove, save, render };
    }

    parkingLot().render();
   
    $('#register')?.addEventListener('click', () => {
        const name = $('#name')?.value;
        const licensePlate = $('#license-plate')?.value;

        if (!name || !licensePlate) {
            alert('Os campos de nome e placa são obrigatórios.');
            return;
        }

        parkingLot().add({ name, licensePlate, arrival: new Date().toISOString() }, true);
    });
})();