// Main Application Class
class VectorDiffApp {
    constructor() {
        this.currentDimension = '1D';
        this.isPlaying = false;
        this.currentTime = 0;
        this.speed = 1.0;
        this.animationId = null;
        this.lastFrameTime = 0;
        
        this.canvas = document.getElementById('visualization-canvas');
        this.ctx = this.canvas.getContext('2d');
        
        this.dimensions = {
            '1D': new Dimension1D(this.canvas, this.ctx),
            '2D': new Dimension2D(this.canvas, this.ctx),
            '3D': new Dimension3D(this.canvas, this.ctx),
            '4D': new Dimension4D(this.canvas, this.ctx),
            '5D': new Dimension5D(this.canvas, this.ctx)
        };
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.switchDimension('1D');
        this.updateJSON();
    }
    
    setupEventListeners() {
        // Dimension buttons
        document.querySelectorAll('.dimension-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.switchDimension(e.target.dataset.dimension);
            });
        });
        
        // Timeline controls
        document.getElementById('play-btn').addEventListener('click', () => this.play());
        document.getElementById('pause-btn').addEventListener('click', () => this.pause());
        document.getElementById('reset-btn').addEventListener('click', () => this.reset());
        
        // Sliders
        document.getElementById('time-slider').addEventListener('input', (e) => {
            this.currentTime = parseFloat(e.target.value);
            this.updateTimeDisplay();
            this.updateVisualization();
        });
        
        document.getElementById('speed-slider').addEventListener('input', (e) => {
            this.speed = parseFloat(e.target.value);
            document.getElementById('speed-value').textContent = this.speed.toFixed(1);
        });
    }
    
    switchDimension(dimension) {
        this.pause();
        this.currentDimension = dimension;
        this.currentTime = 0;
        
        // Update button states
        document.querySelectorAll('.dimension-btn').forEach(btn => {
            btn.classList.remove('active');
            btn.classList.remove('btn--primary');
            btn.classList.add('btn--secondary');
            if (btn.dataset.dimension === dimension) {
                btn.classList.add('active');
                btn.classList.add('btn--primary');
                btn.classList.remove('btn--secondary');
            }
        });
        
        // Update UI
        this.updateDimensionInfo();
        this.updateControls();
        this.updateVisualization();
        this.updateJSON();
        
        // Reset time slider
        document.getElementById('time-slider').value = 0;
        this.updateTimeDisplay();
    }
    
    updateDimensionInfo() {
        const info = this.getDimensionInfo(this.currentDimension);
        document.getElementById('dimension-title').textContent = info.title;
        document.getElementById('dimension-description').textContent = info.description;
        document.getElementById('concepts-content').innerHTML = info.concepts;
    }
    
    getDimensionInfo(dimension) {
        const info = {
            '1D': {
                title: 'Wymiar 1D - Linia',
                description: 'Obiekty poruszają się wzdłuż pojedynczej linii',
                concepts: `
                    <h4>Wymiar 1D</h4>
                    <p>Najprostszy wymiar - obiekty mogą poruszać się tylko tam i z powrotem wzdłuż linii.</p>
                    <ul>
                        <li>Pozycja: pojedyncza wartość [x]</li>
                        <li>Prędkość: kierunek i wartość na linii</li>
                        <li>Przykład: punkt poruszający się po prostej</li>
                    </ul>
                `
            },
            '2D': {
                title: 'Wymiar 2D - Powierzchnia',
                description: 'Obiekty poruszają się w płaszczyźnie z współrzędnymi X,Y',
                concepts: `
                    <h4>Wymiar 2D</h4>
                    <p>Powierzchnia zawierająca nieskończenie wiele światów 1D.</p>
                    <ul>
                        <li>Pozycja: [x, y]</li>
                        <li>Prędkość: wektor w płaszczyźnie</li>
                        <li>Może zawierać nieskończenie wiele linii 1D</li>
                    </ul>
                `
            },
            '3D': {
                title: 'Wymiar 3D - Przestrzeń',
                description: 'Obiekty poruszają się w przestrzeni 3D z współrzędnymi X,Y,Z',
                concepts: `
                    <h4>Wymiar 3D</h4>
                    <p>Przestrzeń zawierająca nieskończenie wiele powierzchni 2D.</p>
                    <ul>
                        <li>Pozycja: [x, y, z]</li>
                        <li>Prędkość: wektor w przestrzeni</li>
                        <li>Może zawierać nieskończenie wiele płaszczyzn 2D</li>
                    </ul>
                `
            },
            '4D': {
                title: 'Wymiar 4D - Czasoprzestrzeń',
                description: 'Przestrzeń 3D + czas jako czwarty wymiar',
                concepts: `
                    <h4>Wymiar 4D - Czasoprzestrzeń</h4>
                    <p>Czas jako czwarty wymiar otwiera nowe możliwości.</p>
                    <ul>
                        <li>Pozycja: [x, y, z, t]</li>
                        <li>Linie świata: ścieżki obiektów przez czasoprzestrzeń</li>
                        <li>Podróże w czasie: poruszanie się wzdłuż wymiaru czasowego</li>
                        <li>Względność: różne przepływy czasu</li>
                    </ul>
                `
            },
            '5D': {
                title: 'Wymiar 5D - Meta-czas',
                description: 'Wiele wszechświatów 4D z różnymi szybkościami czasowymi',
                concepts: `
                    <h4>Wymiar 5D - Meta-czas</h4>
                    <p>Piąty wymiar kontroluje szybkość zmian czasowych.</p>
                    <ul>
                        <li>Wiele wszechświatów 4D równocześnie</li>
                        <li>Różne szybkości przepływu czasu</li>
                        <li>Interakcje między wszechświatami</li>
                        <li>Bifurkacja wszechświatów</li>
                    </ul>
                `
            }
        };
        return info[dimension];
    }
    
    updateControls() {
        const controlsDiv = document.getElementById('dimension-controls');
        const currentDim = this.dimensions[this.currentDimension];
        controlsDiv.innerHTML = currentDim.getControlsHTML();
        
        // Add event listeners for new controls
        currentDim.setupControlListeners();
    }
    
    play() {
        if (!this.isPlaying) {
            this.isPlaying = true;
            this.lastFrameTime = performance.now();
            this.animate();
        }
    }
    
    pause() {
        this.isPlaying = false;
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
    }
    
    reset() {
        this.pause();
        this.currentTime = 0;
        document.getElementById('time-slider').value = 0;
        this.updateTimeDisplay();
        this.dimensions[this.currentDimension].reset();
        this.updateVisualization();
        this.updateJSON();
    }
    
    animate() {
        if (!this.isPlaying) return;
        
        const currentFrameTime = performance.now();
        const deltaTime = (currentFrameTime - this.lastFrameTime) / 1000;
        this.lastFrameTime = currentFrameTime;
        
        this.currentTime += deltaTime * this.speed;
        
        // Update slider
        document.getElementById('time-slider').value = this.currentTime;
        this.updateTimeDisplay();
        
        // Update visualization
        this.updateVisualization();
        this.updateJSON();
        
        this.animationId = requestAnimationFrame(() => this.animate());
    }
    
    updateTimeDisplay() {
        document.getElementById('time-value').textContent = this.currentTime.toFixed(1);
    }
    
    updateVisualization() {
        this.dimensions[this.currentDimension].render(this.currentTime);
    }
    
    updateJSON() {
        const json = this.dimensions[this.currentDimension].getVectorDiffJSON(this.currentTime);
        document.getElementById('vectordiff-json').textContent = JSON.stringify(json, null, 2);
    }
}

// Base Dimension Class
class BaseDimension {
    constructor(canvas, ctx) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.entities = [];
    }
    
    reset() {
        this.entities = [];
        this.setupEntities();
    }
    
    setupEntities() {
        // Override in subclasses
    }
    
    render(time) {
        // Clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Override in subclasses
    }
    
    getControlsHTML() {
        return '';
    }
    
    setupControlListeners() {
        // Override in subclasses
    }
    
    getVectorDiffJSON(time) {
        return {
            baseScene: {
                dimensions: 1,
                entities: {}
            },
            timeline: []
        };
    }
}

// 1D Dimension
class Dimension1D extends BaseDimension {
    constructor(canvas, ctx) {
        super(canvas, ctx);
        this.setupEntities();
    }
    
    setupEntities() {
        this.entities = [
            {
                id: 'point_A',
                initialPosition: 100,
                velocity: 50,
                color: '#1FB8CD'
            }
        ];
    }
    
    render(time) {
        super.render(time);
        
        const centerY = this.canvas.height / 2;
        const lineLength = this.canvas.width - 100;
        const lineStart = 50;
        
        // Draw 1D line
        this.ctx.strokeStyle = '#626C71';
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.moveTo(lineStart, centerY);
        this.ctx.lineTo(lineStart + lineLength, centerY);
        this.ctx.stroke();
        
        // Draw entities
        this.entities.forEach(entity => {
            const position = entity.initialPosition + entity.velocity * time;
            const x = lineStart + ((position % lineLength) + lineLength) % lineLength;
            
            this.ctx.fillStyle = entity.color;
            this.ctx.beginPath();
            this.ctx.arc(x, centerY, 8, 0, 2 * Math.PI);
            this.ctx.fill();
            
            // Position label
            this.ctx.fillStyle = '#134252';
            this.ctx.font = '12px FKGroteskNeue';
            this.ctx.textAlign = 'center';
            this.ctx.fillText(`${position.toFixed(1)}`, x, centerY - 20);
        });
    }
    
    getControlsHTML() {
        return `
            <div class="control-item">
                <label>Pozycja początkowa:</label>
                <input type="number" id="pos-1d" value="100" min="0" max="500">
            </div>
            <div class="control-item">
                <label>Prędkość:</label>
                <input type="number" id="vel-1d" value="50" min="-100" max="100">
            </div>
        `;
    }
    
    setupControlListeners() {
        document.getElementById('pos-1d')?.addEventListener('input', (e) => {
            this.entities[0].initialPosition = parseFloat(e.target.value);
        });
        
        document.getElementById('vel-1d')?.addEventListener('input', (e) => {
            this.entities[0].velocity = parseFloat(e.target.value);
        });
    }
    
    getVectorDiffJSON(time) {
        return {
            baseScene: {
                dimensions: 1,
                entities: {
                    point_A: {
                        position: [this.entities[0].initialPosition],
                        velocity: [this.entities[0].velocity]
                    }
                }
            },
            timeline: [
                {
                    timestamp: time,
                    operation: "move",
                    changes: {
                        point_A: {
                            position: [this.entities[0].initialPosition + this.entities[0].velocity * time]
                        }
                    }
                }
            ]
        };
    }
}

// 2D Dimension
class Dimension2D extends BaseDimension {
    constructor(canvas, ctx) {
        super(canvas, ctx);
        this.setupEntities();
    }
    
    setupEntities() {
        this.entities = [
            {
                id: 'circle_A',
                initialPosition: [300, 200],
                velocity: [30, 20],
                color: '#FFC185',
                radius: 15
            },
            {
                id: 'circle_B',
                initialPosition: [150, 300],
                velocity: [-20, -15],
                color: '#B4413C',
                radius: 12
            }
        ];
    }
    
    render(time) {
        super.render(time);
        
        // Draw grid to show 2D space
        this.ctx.strokeStyle = '#E5E5E5';
        this.ctx.lineWidth = 1;
        for (let i = 0; i < this.canvas.width; i += 50) {
            this.ctx.beginPath();
            this.ctx.moveTo(i, 0);
            this.ctx.lineTo(i, this.canvas.height);
            this.ctx.stroke();
        }
        for (let i = 0; i < this.canvas.height; i += 50) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, i);
            this.ctx.lineTo(this.canvas.width, i);
            this.ctx.stroke();
        }
        
        // Draw entities
        this.entities.forEach(entity => {
            const x = entity.initialPosition[0] + entity.velocity[0] * time;
            const y = entity.initialPosition[1] + entity.velocity[1] * time;
            
            // Wrap around edges
            const wrappedX = ((x % this.canvas.width) + this.canvas.width) % this.canvas.width;
            const wrappedY = ((y % this.canvas.height) + this.canvas.height) % this.canvas.height;
            
            this.ctx.fillStyle = entity.color;
            this.ctx.beginPath();
            this.ctx.arc(wrappedX, wrappedY, entity.radius, 0, 2 * Math.PI);
            this.ctx.fill();
            
            // Position label
            this.ctx.fillStyle = '#134252';
            this.ctx.font = '10px FKGroteskNeue';
            this.ctx.textAlign = 'center';
            this.ctx.fillText(`(${x.toFixed(0)}, ${y.toFixed(0)})`, wrappedX, wrappedY - entity.radius - 5);
        });
    }
    
    getControlsHTML() {
        return `
            <div class="control-item">
                <label>Pozycja X (A):</label>
                <input type="number" id="pos-x-2d" value="300" min="0" max="600">
            </div>
            <div class="control-item">
                <label>Pozycja Y (A):</label>
                <input type="number" id="pos-y-2d" value="200" min="0" max="400">
            </div>
            <div class="control-item">
                <label>Prędkość X (A):</label>
                <input type="number" id="vel-x-2d" value="30" min="-100" max="100">
            </div>
            <div class="control-item">
                <label>Prędkość Y (A):</label>
                <input type="number" id="vel-y-2d" value="20" min="-100" max="100">
            </div>
        `;
    }
    
    setupControlListeners() {
        document.getElementById('pos-x-2d')?.addEventListener('input', (e) => {
            this.entities[0].initialPosition[0] = parseFloat(e.target.value);
        });
        
        document.getElementById('pos-y-2d')?.addEventListener('input', (e) => {
            this.entities[0].initialPosition[1] = parseFloat(e.target.value);
        });
        
        document.getElementById('vel-x-2d')?.addEventListener('input', (e) => {
            this.entities[0].velocity[0] = parseFloat(e.target.value);
        });
        
        document.getElementById('vel-y-2d')?.addEventListener('input', (e) => {
            this.entities[0].velocity[1] = parseFloat(e.target.value);
        });
    }
    
    getVectorDiffJSON(time) {
        return {
            baseScene: {
                dimensions: 2,
                entities: {
                    circle_A: {
                        position: this.entities[0].initialPosition,
                        velocity: this.entities[0].velocity,
                        radius: this.entities[0].radius
                    },
                    circle_B: {
                        position: this.entities[1].initialPosition,
                        velocity: this.entities[1].velocity,
                        radius: this.entities[1].radius
                    }
                }
            },
            timeline: [
                {
                    timestamp: time,
                    operation: "move",
                    changes: {
                        circle_A: {
                            position: [
                                this.entities[0].initialPosition[0] + this.entities[0].velocity[0] * time,
                                this.entities[0].initialPosition[1] + this.entities[0].velocity[1] * time
                            ]
                        },
                        circle_B: {
                            position: [
                                this.entities[1].initialPosition[0] + this.entities[1].velocity[0] * time,
                                this.entities[1].initialPosition[1] + this.entities[1].velocity[1] * time
                            ]
                        }
                    }
                }
            ]
        };
    }
}

// 3D Dimension
class Dimension3D extends BaseDimension {
    constructor(canvas, ctx) {
        super(canvas, ctx);
        this.setupEntities();
    }
    
    setupEntities() {
        this.entities = [
            {
                id: 'sphere_A',
                initialPosition: [0, 0, 0],
                velocity: [1, 0.5, 0.3],
                color: '#ECEBD5',
                radius: 20
            },
            {
                id: 'sphere_B',
                initialPosition: [2, -1, 1],
                velocity: [-0.5, 0.8, -0.2],
                color: '#5D878F',
                radius: 15
            }
        ];
    }
    
    render(time) {
        super.render(time);
        
        // Simple 3D projection
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;
        
        // Draw 3D axis
        this.ctx.strokeStyle = '#626C71';
        this.ctx.lineWidth = 2;
        
        // X axis (red)
        this.ctx.strokeStyle = '#FF6B6B';
        this.ctx.beginPath();
        this.ctx.moveTo(centerX, centerY);
        this.ctx.lineTo(centerX + 100, centerY);
        this.ctx.stroke();
        
        // Y axis (green)
        this.ctx.strokeStyle = '#4ECDC4';
        this.ctx.beginPath();
        this.ctx.moveTo(centerX, centerY);
        this.ctx.lineTo(centerX, centerY - 100);
        this.ctx.stroke();
        
        // Z axis (blue)
        this.ctx.strokeStyle = '#45B7D1';
        this.ctx.beginPath();
        this.ctx.moveTo(centerX, centerY);
        this.ctx.lineTo(centerX - 50, centerY + 50);
        this.ctx.stroke();
        
        // Draw perspective grid
        this.ctx.strokeStyle = '#E5E5E5';
        this.ctx.lineWidth = 1;
        for (let i = -2; i <= 2; i++) {
            for (let j = -2; j <= 2; j++) {
                const x1 = centerX + i * 40;
                const y1 = centerY + j * 40;
                const x2 = centerX + i * 40 - 25;
                const y2 = centerY + j * 40 + 25;
                
                this.ctx.beginPath();
                this.ctx.moveTo(x1, y1);
                this.ctx.lineTo(x2, y2);
                this.ctx.stroke();
            }
        }
        
        // Draw entities
        this.entities.forEach(entity => {
            const x = entity.initialPosition[0] + entity.velocity[0] * time;
            const y = entity.initialPosition[1] + entity.velocity[1] * time;
            const z = entity.initialPosition[2] + entity.velocity[2] * time;
            
            // Project 3D to 2D
            const projX = centerX + x * 50 - z * 25;
            const projY = centerY - y * 50 + z * 25;
            
            // Size based on z-depth
            const size = entity.radius * (1 + z * 0.1);
            
            this.ctx.fillStyle = entity.color;
            this.ctx.beginPath();
            this.ctx.arc(projX, projY, Math.max(5, size), 0, 2 * Math.PI);
            this.ctx.fill();
            
            // Position label
            this.ctx.fillStyle = '#134252';
            this.ctx.font = '10px FKGroteskNeue';
            this.ctx.textAlign = 'center';
            this.ctx.fillText(`(${x.toFixed(1)}, ${y.toFixed(1)}, ${z.toFixed(1)})`, projX, projY - size - 5);
        });
    }
    
    getControlsHTML() {
        return `
            <div class="control-item">
                <label>Prędkość X (A):</label>
                <input type="number" id="vel-x-3d" value="1" min="-5" max="5" step="0.1">
            </div>
            <div class="control-item">
                <label>Prędkość Y (A):</label>
                <input type="number" id="vel-y-3d" value="0.5" min="-5" max="5" step="0.1">
            </div>
            <div class="control-item">
                <label>Prędkość Z (A):</label>
                <input type="number" id="vel-z-3d" value="0.3" min="-5" max="5" step="0.1">
            </div>
            <div class="control-item">
                <label>Prędkość X (B):</label>
                <input type="number" id="vel-x-3d-b" value="-0.5" min="-5" max="5" step="0.1">
            </div>
        `;
    }
    
    setupControlListeners() {
        document.getElementById('vel-x-3d')?.addEventListener('input', (e) => {
            this.entities[0].velocity[0] = parseFloat(e.target.value);
        });
        
        document.getElementById('vel-y-3d')?.addEventListener('input', (e) => {
            this.entities[0].velocity[1] = parseFloat(e.target.value);
        });
        
        document.getElementById('vel-z-3d')?.addEventListener('input', (e) => {
            this.entities[0].velocity[2] = parseFloat(e.target.value);
        });
        
        document.getElementById('vel-x-3d-b')?.addEventListener('input', (e) => {
            this.entities[1].velocity[0] = parseFloat(e.target.value);
        });
    }
    
    getVectorDiffJSON(time) {
        return {
            baseScene: {
                dimensions: 3,
                entities: {
                    sphere_A: {
                        position: this.entities[0].initialPosition,
                        velocity: this.entities[0].velocity,
                        radius: this.entities[0].radius
                    },
                    sphere_B: {
                        position: this.entities[1].initialPosition,
                        velocity: this.entities[1].velocity,
                        radius: this.entities[1].radius
                    }
                }
            },
            timeline: [
                {
                    timestamp: time,
                    operation: "move",
                    changes: {
                        sphere_A: {
                            position: [
                                this.entities[0].initialPosition[0] + this.entities[0].velocity[0] * time,
                                this.entities[0].initialPosition[1] + this.entities[0].velocity[1] * time,
                                this.entities[0].initialPosition[2] + this.entities[0].velocity[2] * time
                            ]
                        },
                        sphere_B: {
                            position: [
                                this.entities[1].initialPosition[0] + this.entities[1].velocity[0] * time,
                                this.entities[1].initialPosition[1] + this.entities[1].velocity[1] * time,
                                this.entities[1].initialPosition[2] + this.entities[1].velocity[2] * time
                            ]
                        }
                    }
                }
            ]
        };
    }
}

// 4D Dimension (Spacetime)
class Dimension4D extends BaseDimension {
    constructor(canvas, ctx) {
        super(canvas, ctx);
        this.temporalVelocity = 1.0;
        this.curvature = 0.0;
        this.setupEntities();
    }
    
    setupEntities() {
        this.entities = [
            {
                id: 'particle_A',
                worldline: [],
                velocity: [30, 20, 10],
                color: '#5D878F',
                properTime: 0
            }
        ];
    }
    
    render(time) {
        super.render(time);
        
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;
        
        // Draw spacetime grid
        this.ctx.strokeStyle = '#E5E5E5';
        this.ctx.lineWidth = 1;
        
        // Spatial grid
        for (let i = 0; i < this.canvas.width; i += 40) {
            this.ctx.beginPath();
            this.ctx.moveTo(i, 0);
            this.ctx.lineTo(i, this.canvas.height);
            this.ctx.stroke();
        }
        
        // Time grid (curved if curvature is applied)
        for (let i = 0; i < this.canvas.height; i += 40) {
            this.ctx.beginPath();
            if (this.curvature !== 0) {
                // Curved spacetime
                for (let x = 0; x < this.canvas.width; x += 10) {
                    const curve = this.curvature * 20 * Math.sin(x * 0.01);
                    if (x === 0) {
                        this.ctx.moveTo(x, i + curve);
                    } else {
                        this.ctx.lineTo(x, i + curve);
                    }
                }
            } else {
                this.ctx.moveTo(0, i);
                this.ctx.lineTo(this.canvas.width, i);
            }
            this.ctx.stroke();
        }
        
        // Draw worldline
        this.ctx.strokeStyle = '#5D878F';
        this.ctx.lineWidth = 3;
        this.ctx.beginPath();
        
        let worldlinePoints = [];
        for (let t = 0; t <= time; t += 0.1) {
            const adjustedTime = t * this.temporalVelocity;
            const x = centerX + this.entities[0].velocity[0] * adjustedTime * 0.5;
            const y = centerY + this.entities[0].velocity[1] * adjustedTime * 0.5;
            worldlinePoints.push([x, y]);
        }
        
        if (worldlinePoints.length > 1) {
            this.ctx.moveTo(worldlinePoints[0][0], worldlinePoints[0][1]);
            for (let i = 1; i < worldlinePoints.length; i++) {
                this.ctx.lineTo(worldlinePoints[i][0], worldlinePoints[i][1]);
            }
            this.ctx.stroke();
        }
        
        // Draw current particle position
        if (worldlinePoints.length > 0) {
            const lastPoint = worldlinePoints[worldlinePoints.length - 1];
            this.ctx.fillStyle = this.entities[0].color;
            this.ctx.beginPath();
            this.ctx.arc(lastPoint[0], lastPoint[1], 8, 0, 2 * Math.PI);
            this.ctx.fill();
        }
        
        // Draw time coordinate
        this.ctx.fillStyle = '#134252';
        this.ctx.font = '14px FKGroteskNeue';
        this.ctx.textAlign = 'left';
        this.ctx.fillText(`Czas: ${time.toFixed(2)}s`, 10, 30);
        this.ctx.fillText(`Prędkość czasowa: ${this.temporalVelocity.toFixed(1)}x`, 10, 50);
        this.ctx.fillText(`Linia świata: ${worldlinePoints.length} punktów`, 10, 70);
    }
    
    getControlsHTML() {
        return `
            <div class="spacetime-controls">
                <div class="control-item">
                    <label>Prędkość czasowa:</label>
                    <input type="range" id="temporal-vel-4d" value="1" min="0.1" max="2" step="0.1">
                    <span id="temporal-vel-value">1.0</span>
                </div>
                <div class="control-item">
                    <label>Zakrzywienie czasoprzestrzeni:</label>
                    <input type="range" id="curvature-4d" value="0" min="-1" max="1" step="0.1">
                    <span id="curvature-value">0.0</span>
                </div>
                <div class="worldline-info">
                    <strong>Linia świata:</strong> Ścieżka cząstki przez czasoprzestrzeń
                </div>
            </div>
        `;
    }
    
    setupControlListeners() {
        document.getElementById('temporal-vel-4d')?.addEventListener('input', (e) => {
            const value = parseFloat(e.target.value);
            this.temporalVelocity = value;
            document.getElementById('temporal-vel-value').textContent = value.toFixed(1);
        });
        
        document.getElementById('curvature-4d')?.addEventListener('input', (e) => {
            const value = parseFloat(e.target.value);
            this.curvature = value;
            document.getElementById('curvature-value').textContent = value.toFixed(1);
        });
    }
    
    getVectorDiffJSON(time) {
        return {
            baseScene: {
                dimensions: 4,
                spacetime_fabric: "minkowski",
                temporal_velocity: this.temporalVelocity,
                curvature: this.curvature,
                entities: {
                    particle_A: {
                        worldline_start: [0, 0, 0, 0],
                        velocity: this.entities[0].velocity,
                        proper_time: this.entities[0].properTime
                    }
                }
            },
            timeline: [
                {
                    spacetime_coordinate: [
                        this.entities[0].velocity[0] * time * this.temporalVelocity,
                        this.entities[0].velocity[1] * time * this.temporalVelocity,
                        this.entities[0].velocity[2] * time * this.temporalVelocity,
                        time * this.temporalVelocity
                    ],
                    operation: "worldline_evolution",
                    changes: {
                        particle_A: {
                            worldline_segment: [
                                [0, 0, 0, 0],
                                [
                                    this.entities[0].velocity[0] * time * this.temporalVelocity,
                                    this.entities[0].velocity[1] * time * this.temporalVelocity,
                                    this.entities[0].velocity[2] * time * this.temporalVelocity,
                                    time * this.temporalVelocity
                                ]
                            ]
                        }
                    }
                }
            ]
        };
    }
}

// 5D Dimension (Meta-temporal)
class Dimension5D extends BaseDimension {
    constructor(canvas, ctx) {
        super(canvas, ctx);
        this.setupEntities();
        this.metaTime = 0;
        this.metaTimeMultiplier = 1.0;
    }
    
    setupEntities() {
        this.entities = [
            {
                id: 'universe_A',
                temporalFlowRate: 1.0,
                expansionRate: 70,
                age: 0,
                color: '#DB4545',
                y: 100
            },
            {
                id: 'universe_B',
                temporalFlowRate: 0.5,
                expansionRate: 140,
                age: 0,
                color: '#D2BA4C',
                y: 200
            },
            {
                id: 'universe_C',
                temporalFlowRate: 1.5,
                expansionRate: 35,
                age: 0,
                color: '#964325',
                y: 300
            }
        ];
    }
    
    render(time) {
        super.render(time);
        
        // Update meta-time
        this.metaTime = time * this.metaTimeMultiplier;
        
        // Draw multiverse visualization
        this.ctx.fillStyle = '#134252';
        this.ctx.font = '14px FKGroteskNeue';
        this.ctx.textAlign = 'left';
        this.ctx.fillText(`Meta-czas: ${this.metaTime.toFixed(2)}`, 10, 30);
        this.ctx.fillText(`Multiplier: ${this.metaTimeMultiplier.toFixed(1)}x`, 10, 50);
        
        // Draw universe timelines
        this.entities.forEach((universe, index) => {
            const universeAge = universe.age + universe.temporalFlowRate * time;
            const expansionSize = Math.min(80, Math.max(10, universeAge * 8));
            
            // Draw universe as expanding circle
            this.ctx.strokeStyle = universe.color;
            this.ctx.lineWidth = 3;
            this.ctx.beginPath();
            this.ctx.arc(100 + index * 150, universe.y, expansionSize, 0, 2 * Math.PI);
            this.ctx.stroke();
            
            // Fill with low opacity
            this.ctx.fillStyle = universe.color + '20';
            this.ctx.fill();
            
            // Universe info
            this.ctx.fillStyle = universe.color;
            this.ctx.font = '12px FKGroteskNeue';
            this.ctx.textAlign = 'center';
            this.ctx.fillText(`Wszechświat ${String.fromCharCode(65 + index)}`, 100 + index * 150, universe.y - expansionSize - 10);
            this.ctx.fillText(`Wiek: ${universeAge.toFixed(1)}`, 100 + index * 150, universe.y - expansionSize - 25);
            this.ctx.fillText(`Przepływ: ${universe.temporalFlowRate}x`, 100 + index * 150, universe.y - expansionSize - 40);
        });
        
        // Draw interactions between universes
        this.ctx.strokeStyle = '#944454';
        this.ctx.lineWidth = 2;
        this.ctx.setLineDash([5, 5]);
        
        for (let i = 0; i < this.entities.length - 1; i++) {
            const universe1 = this.entities[i];
            const universe2 = this.entities[i + 1];
            
            // Draw connection if flow rates are similar
            if (Math.abs(universe1.temporalFlowRate - universe2.temporalFlowRate) < 0.7) {
                this.ctx.beginPath();
                this.ctx.moveTo(100 + i * 150, universe1.y);
                this.ctx.lineTo(100 + (i + 1) * 150, universe2.y);
                this.ctx.stroke();
            }
        }
        
        this.ctx.setLineDash([]);
    }
    
    getControlsHTML() {
        return `
            <div class="meta-temporal-controls">
                <div class="control-item">
                    <label>Meta-czas:</label>
                    <input type="range" id="meta-time-5d" value="1" min="0.1" max="3" step="0.1">
                    <span id="meta-time-value">1.0</span>
                </div>
                
                <div class="universe-control">
                    <h5>Wszechświat A</h5>
                    <div class="control-item">
                        <label>Przepływ czasowy:</label>
                        <input type="range" id="flow-a-5d" value="1.0" min="0.1" max="2" step="0.1">
                        <span id="flow-a-value">1.0</span>
                    </div>
                </div>
                
                <div class="universe-control">
                    <h5>Wszechświat B</h5>
                    <div class="control-item">
                        <label>Przepływ czasowy:</label>
                        <input type="range" id="flow-b-5d" value="0.5" min="0.1" max="2" step="0.1">
                        <span id="flow-b-value">0.5</span>
                    </div>
                </div>
                
                <div class="universe-control">
                    <h5>Wszechświat C</h5>
                    <div class="control-item">
                        <label>Przepływ czasowy:</label>
                        <input type="range" id="flow-c-5d" value="1.5" min="0.1" max="2" step="0.1">
                        <span id="flow-c-value">1.5</span>
                    </div>
                </div>
                
                <div class="multiverse-info">
                    <strong>Wymiar 5D:</strong> Kontroluje szybkość przepływu czasu w różnych wszechświatach
                    <div class="universe-stats">
                        <span>Wszechświaty: 3</span>
                        <span>Interakcje: Aktywne</span>
                        <span>Bifurkacje: 2</span>
                    </div>
                </div>
            </div>
        `;
    }
    
    setupControlListeners() {
        document.getElementById('meta-time-5d')?.addEventListener('input', (e) => {
            const value = parseFloat(e.target.value);
            this.metaTimeMultiplier = value;
            document.getElementById('meta-time-value').textContent = value.toFixed(1);
        });
        
        document.getElementById('flow-a-5d')?.addEventListener('input', (e) => {
            const value = parseFloat(e.target.value);
            this.entities[0].temporalFlowRate = value;
            document.getElementById('flow-a-value').textContent = value.toFixed(1);
        });
        
        document.getElementById('flow-b-5d')?.addEventListener('input', (e) => {
            const value = parseFloat(e.target.value);
            this.entities[1].temporalFlowRate = value;
            document.getElementById('flow-b-value').textContent = value.toFixed(1);
        });
        
        document.getElementById('flow-c-5d')?.addEventListener('input', (e) => {
            const value = parseFloat(e.target.value);
            this.entities[2].temporalFlowRate = value;
            document.getElementById('flow-c-value').textContent = value.toFixed(1);
        });
    }
    
    getVectorDiffJSON(time) {
        return {
            baseScene: {
                dimensions: 5,
                meta_temporal_fabric: "multiverse",
                meta_time_multiplier: this.metaTimeMultiplier,
                entities: {
                    universe_A: {
                        temporal_flow_rate: this.entities[0].temporalFlowRate,
                        expansion_rate: this.entities[0].expansionRate,
                        age: this.entities[0].age
                    },
                    universe_B: {
                        temporal_flow_rate: this.entities[1].temporalFlowRate,
                        expansion_rate: this.entities[1].expansionRate,
                        age: this.entities[1].age
                    },
                    universe_C: {
                        temporal_flow_rate: this.entities[2].temporalFlowRate,
                        expansion_rate: this.entities[2].expansionRate,
                        age: this.entities[2].age
                    }
                }
            },
            timeline: [
                {
                    meta_time: this.metaTime,
                    operation: "meta_temporal_evolution",
                    changes: {
                        universe_A: {
                            age: this.entities[0].age + this.entities[0].temporalFlowRate * time
                        },
                        universe_B: {
                            age: this.entities[1].age + this.entities[1].temporalFlowRate * time
                        },
                        universe_C: {
                            age: this.entities[2].age + this.entities[2].temporalFlowRate * time
                        }
                    }
                }
            ]
        };
    }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    new VectorDiffApp();
});