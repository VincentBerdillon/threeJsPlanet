const THREE = require('three');

class Planet {
    scene;
    camera;
    renderer;
    geometry;
    material;
    mesh;
    light;

    constructor() {
        console.log("Bienvenue sur la planète !");
        this.init();
    }

    // méthode dans laquelle on va créer la scène pour dessiner notre planète
    init = () => {
        // ***** SCENE + CAMERA ***** //
        // ici onb crée une scène = un "espace" dans lequel on peut "dessiner" en 3D avec three.js
        // on instancie la classe Scene fournie par three.js
        this.scene = new THREE.Scene();
        // création d'une caméra = un point de vue pour voir la scène
        this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1000);
        // on déplace la caméra sur l'axe des z (profondeur) pour prendre du recul sur la scène
        this.camera.position.z = 15;
        // on ajoute la caméra dans la scène
        this.scene.add(this.camera);


        // ***** FORME ***** //
        // ici on va créer notre planète
        // on crée un volume (une forme)
        this.geometry = new THREE.SphereGeometry(5, 64, 64);
        // on prépare une texture à appliquer sur notre surface
        this.material = new THREE.MeshLambertMaterial({
            color: new THREE.Color('rgb(0, 150, 250)')
        });
        // on crée un "mesh" = une forme avec une texture
        this.mesh = new THREE.Mesh(this.geometry, this.material);
        // on ajoute notre mesh à la scène
        this.scene.add(this.mesh);


        // this.light = new THREE.PointLight();
        // this.light.position.set(0, 0, 1);
        // this.scene.add(this.light);

        // ***** LUMIERE ***** //
        // on ajoute de la lumière pour y voir quelque chose 
        this.light = new THREE.PointLight(0xffffff, 5000, 0, 2)
        // params : color / intensity / distance
        this.light.position.set(30, 30, 30);
        // on l'ajoute à la scène
        this.scene.add(this.light);



        // ***** RENDU ***** //
        // on dessine la scène grâce à un moteur de rendu (webGL)
        this.renderer = new THREE.WebGLRenderer({
            antialias: true
        });
        // on lui précise la taille de notre zone de dessin
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        // on injecte notre zone de dessin dans le DOM
        document.body.appendChild(this.renderer.domElement);
        // enfin on dit à notre renderer de rendre la scène
        // => on transpose nos formes et nos vecteurs en pixels calculés
        // on fait le rendu 3D d'uns cène, depuis le point de vue d'une caméra
        this.renderer.render(this.scene, this.camera);

        // on veut réagit au redimentionnement de la fenêtre pour dire à notre caméra que la surface visible à changé
        window.addEventListener('resize', this.handleWindowResize);

        // je lance l'animation une première fois
        this.animate();
    };

    handleWindowResize = () => {
        console.log('resize !');
        // refconfigurer la caméra
        this.camera.aspect = window.innerWidth / window.innerHeight;
        // les nouvelles tailles après le redimentionnement

        // chaque fois qu'on change l'aspect de la caméra il faut apeller cette péthode (pour que three recalcule toutes les formes)
        this.camera.updateProjectionMatrix();

        // on mets aussi à jour notre zone de rendu
        this.renderer.setSize(window.innerWidth, window.innerHeight);

        // on a modifié quelque chose dans la scène, donc il faut la redessinner
        this.renderer.render(this.scene, this.camera);
    };

    getTime = () => {
        // fonction qui retourne la date précise  en milisecondes
        // on ralentis le temps en divisant la valeur de Date.now
        return Date.now() / 1000;
    }

    animate = () => {
        // ici on va faire bouger la caméra pour donner l'impression que la planète tourne autour du soleil

        // on bouge la caméra
        // je récupère le "temps" courant (en ms)
        const time = this.getTime();
        // on utilise les contions cos et sin qui prennent en paramètre un temps, et retournent un nombre qui varie entre -1 et 1
        // on ajoute un coeffiscient multiplicateur pour augmenter le rayon de l'orbite
        // là elle va tourner entre -15 et 15
        this.camera.position.x = Math.cos(time) * 15;
        this.camera.position.z = Math.sin(time) * 15;

        // la mera par defaut regarde tout le temps devant elle
        // on l'oriente vers le centre de la shère pour quelle la regarde en permanance
        this.camera.lookAt(this.mesh.position);

        // puis on redessine la scène
        this.renderer.render(this.scene, this.camera);



        // on veut que cette fonction soit apellée très souvent pour qu'on voit une animation bien fluide
        // méthode old school
        // setInterval(this.animate, 1000/30); // lé mathode s'apelle elle même 30 fois par seconde
        // on pourrait aussi juste apeller la fonction :
        // this.animate() // là fonction serait aepllée en permanance genre 500 fois par secondes, l'ordi va exploser !
        // il y au n truc beaucoup mieux : requestAnimationFrame
        // relance cette fonction chaque fois qu'il y a un rafraichissement de l'écran (le navigateur sait quand il doit le faire)
        requestAnimationFrame(this.animate);
    }
}

module.exports = Planet;