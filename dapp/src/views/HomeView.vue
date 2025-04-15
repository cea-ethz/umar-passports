<template>
  <v-toolbar class="bg-white">
    <img src="../assets/compas_logo_blue.png" width="48px" class="mx-2" />
    <v-toolbar-title> UMAR </v-toolbar-title>
    <v-btn @click="addGLB('umar')" variant="elevated" class="mx-1">
      UMAR
    </v-btn>
    <v-btn @click="addGLB('bricks', true)" variant="elevated" class="mx-1">
      Bricks
    </v-btn>
    <v-btn
      @click="addGLB('gemma_curtain', true)"
      variant="elevated"
      class="mx-1"
    >
      Gemma Curtain
    </v-btn>
    <WalletConnector />
  </v-toolbar>
  <MintingStrategies />
  <v-container class="pa-0 ma-0">
    <v-row no-gutters>
      <v-col cols="12" class="pa-0 ma-0">
        <v-sheet
          class="bg-blue-grey-lighten-4"
          :height="contentHeight"
          v-resize="onResize"
        >
          <div id="three-container"></div>
        </v-sheet>
      </v-col>
    </v-row>
  </v-container>
  <v-dialog v-model="dialog.visible" width="480" persistent>
    <v-card>
      <v-card-title
        class="d-flex justify-space-between align-center"
        style="position: relative"
      >
        <span>{{ dialog.title }}</span>
        <v-btn
          icon
          @click="dialog.visible = false"
          style="position: absolute; top: 8px; right: 8px"
        >
          <v-icon style="font-size: 16px">mdi-close</v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text>
        <p style="font-weight: bold; margin-bottom: 8px">NFT</p>
        <v-btn
          :href="`https://testnets.opensea.io/assets/sepolia/0xb8Bb0430e7c3392642Cd141824FBf7D300F18901/${dialog.data.tokenId}`"
          target="_blank"
          variant="outlined"
          color="primary"
          size="small"
        >
          View NFT on OpenSea
        </v-btn>
      </v-card-text>
      <v-card-text>
        <p style="font-weight: bold; margin-bottom: 8px">Material Passport</p>
        <json-tree
          v-if="dialog.data.material_passport"
          :data="dialog.data.material_passport"
        />
        <div v-else>{{ dialog.data }}</div>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import compas from "@/api/compas";
import WalletConnector from "@/components/WalletConnector.vue";
import MintingStrategies from "@/components/MintingStrategies.vue";
import JsonTree from "@/components/JsonTree.vue";

import cooperJson from "@/data/cooper.json";
import gemmaCurtainJson from "@/data/gemma_curtain.json";

const scene = new THREE.Scene();
scene.background = new THREE.Color(0xeeeeee);

export default {
  components: {
    WalletConnector,
    MintingStrategies,
    JsonTree,
  },
  data: () => ({
    dialog: {
      visible: false,
      title: "",
      data: null,
    },
    removeFromTop: 64,
    contentHeight: window.innerHeight - 64,
    config: {
      camera: {
        fov: 75,
        aspect: window.innerWidth / window.innerHeight,
        near: 0.1,
        far: 1000,
      },
      grid: {
        size: 20,
        divisions: 20,
        colorCenterLine: 0x7f7f7f,
        colorGrid: 0xbfbfbf,
      },
    },
    camera: null,
    raycaster: new THREE.Raycaster(),
    mouse: new THREE.Vector2(),
    selectableMeshes: [],
  }),
  computed: {
    treeItems() {
      if (!this.dialog.data) return [];
      return this.jsonToTreeItems(this.dialog.data);
    },
  },
  methods: {
    onResize() {
      this.contentHeight = window.innerHeight - this.removeFromTop;
    },
    initThree() {
      const camera = new THREE.PerspectiveCamera(
        this.config.camera.fov,
        this.config.camera.aspect,
        this.config.camera.near,
        this.config.camera.far
      );
      camera.up.set(0, 0, 1);
      camera.position.set(15, 25, 1.2);
      this.camera = camera;

      const renderer = new THREE.WebGLRenderer({
        antialias: true,
        autoSize: true,
      });
      renderer.setSize(window.innerWidth, this.contentHeight);
      renderer.setAnimationLoop(() => {
        renderer.render(scene, camera);
      });

      // Add ambient light for overall scene illumination
      const ambientLight = new THREE.AmbientLight(0xffffff, 1);
      scene.add(ambientLight);

      // Add directional light for shadows and depth
      const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
      directionalLight.position.set(5, 5, 5);
      directionalLight.castShadow = true;
      scene.add(directionalLight);

      const container = document.getElementById("three-container");
      container.appendChild(renderer.domElement);
      container.addEventListener("mousemove", this.onMouseMove, false);
      container.addEventListener("click", this.onMeshClick, false);

      const controls = new OrbitControls(camera, renderer.domElement);
    },
    addBox() {
      const geometry = new THREE.BoxGeometry(1, 1, 1);
      const material = new THREE.MeshBasicMaterial({ color: 0xcccccc });
      const cube = new THREE.Mesh(geometry, material);
      cube.userData.interactive = true;
      this.selectableMeshes.push(cube);
      const edges = new THREE.EdgesGeometry(geometry);
      const line = new THREE.LineSegments(
        edges,
        new THREE.LineBasicMaterial({ color: 0xaaaaaa })
      );
      scene.add(cube);
      scene.add(line);
    },
    addAxes() {
      const axes = new THREE.AxesHelper(1);
      scene.add(axes);
    },
    addGrid() {
      const grid = new THREE.GridHelper(
        this.config.grid.size,
        this.config.grid.divisions,
        this.config.grid.colorCenterLine,
        this.config.grid.colorGrid
      );
      grid.rotation.x = Math.PI / 2;
      scene.add(grid);
    },
    addGLB(name, selectable = false) {
      const loader = new GLTFLoader();

      const loadModel = (jsonData = null) => {
        loader.load(
          `/compas-webviewer/${name}.glb`,
          (gltf) => {
            const model = gltf.scene;
            model.userData.interactive = true;

            // Set all materials to white and transparent, and add edge geometry
            model.traverse((child) => {
              if (child.isMesh) {
                if (!selectable) {
                  // Set the main mesh material
                  child.material = new THREE.MeshStandardMaterial({
                    color: 0xffffff,
                    transparent: true,
                    opacity: 0.2,
                  });
                } else {
                  // Set the main mesh material
                  child.material = new THREE.MeshStandardMaterial({
                    color: 0xffffff,
                  });

                  child.userData.data = jsonData;
                  child.userData.data.tokenId = jsonData?.tokenId || "1231231";
                  child.geometry.computeVertexNormals();
                  // child.geometry.computeFaceNormals();
                  this.selectableMeshes.push(child);
                }

                // Create edges geometry for non-coplanar faces
                const edges = new THREE.EdgesGeometry(child.geometry, 30); // 15 degrees threshold
                const line = new THREE.LineSegments(
                  edges,
                  new THREE.LineBasicMaterial({
                    color: 0x555555,
                    transparent: true,
                    opacity: 0.1,
                    linewidth: 1,
                  })
                );

                // Add the line segments as a child of the mesh
                scene.add(line);
              }
            });

            scene.add(model);
          },
          (xhr) => {
            console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
          },
          (error) => {
            console.error("An error happened while loading the model:", error);
          }
        );
      };

      if (selectable) {
        // Load JSON file first if selectable
        fetch(`/compas-webviewer/${name}.json`)
          .then((response) => response.json())
          .then((jsonData) => {
            loadModel(jsonData);
          })
          .catch((error) => {
            console.error("Error loading JSON file:", error);
            loadModel(); // Load model anyway even if JSON fails
          });
      } else {
        // Load model directly if not selectable
        loadModel();
      }
    },
    onMouseMove(event) {
      const containerRect = event.target.getBoundingClientRect();
      this.mouse.x =
        ((event.clientX - containerRect.left) / containerRect.width) * 2 - 1;
      this.mouse.y =
        -((event.clientY - containerRect.top) / containerRect.height) * 2 + 1;
      this.raycaster.setFromCamera(this.mouse, this.camera);
      const intersects = this.raycaster.intersectObjects(this.selectableMeshes);
      if (intersects.length > 0) {
        const mesh = intersects[0].object;
        mesh.material.color.set(0xffff00);
        event.target.style.cursor = "pointer";
      } else {
        this.selectableMeshes.forEach((mesh) => {
          mesh.material.color.set(0xffffff);
        });
        event.target.style.cursor = "default";
      }

      console.log(this.camera.position);
      console.log(this.camera.target);
    },
    onMeshClick(event) {
      const containerRect = event.target.getBoundingClientRect();
      this.mouse.x =
        ((event.clientX - containerRect.left) / containerRect.width) * 2 - 1;
      this.mouse.y =
        -((event.clientY - containerRect.top) / containerRect.height) * 2 + 1;
      this.raycaster.setFromCamera(this.mouse, this.camera);
      const intersects = this.raycaster.intersectObjects(this.selectableMeshes);
      if (intersects.length > 0) {
        const mesh = intersects[0].object;
        if (mesh.userData.data) {
          this.showDialog(mesh.userData.data);
        } else {
          this.showDialog("Mesh Clicked", { info: "You clicked on a mesh!" });
        }
      }
    },
    showDialog(data) {
      this.dialog.visible = true;
      this.dialog.title = data.name;
      this.dialog.data = data;
    },
    jsonToTreeItems(obj) {
      let idCounter = 0;
      const traverse = (node) => {
        if (node !== null && typeof node === "object") {
          if (Array.isArray(node)) {
            return node.map((item, index) => {
              idCounter++;
              return {
                id: idCounter,
                name:
                  `[${index}]` + (typeof item !== "object" ? `: ${item}` : ""),
                children: typeof item === "object" ? traverse(item) : [],
              };
            });
          } else {
            return Object.entries(node).map(([key, value]) => {
              idCounter++;
              return {
                id: idCounter,
                name: key + (typeof value !== "object" ? `: ${value}` : ""),
                children: typeof value === "object" ? traverse(value) : [],
              };
            });
          }
        } else {
          return [];
        }
      };
      return traverse(obj) || [];
    },
    ping() {
      compas.ping().then((response) => {
        this.showDialog("Info", { info: `ping says: ${response}` });
      });
    },
  },
  mounted() {
    this.initThree();
    // this.addGrid();
  },
};
</script>
