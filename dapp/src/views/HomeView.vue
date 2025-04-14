<template>
  <v-toolbar class="bg-white">
    <img src="../assets/compas_logo_blue.png" width="48px" class="mx-2" />
    <v-toolbar-title> COMPAS WebViewer </v-toolbar-title>
    <v-btn @click="ping" variant="elevated" class="mx-1"> Ping </v-btn>
    <v-btn @click="boxToSubdividedMesh" variant="elevated" class="mx-1">
      Getting Started
    </v-btn>
    <v-btn @click="loadGemmaCurtain" variant="elevated" class="mx-1">
      Gemma Curtain
    </v-btn>
    <v-btn @click="loadCooper" variant="elevated" class="mx-1"> Cooper </v-btn>
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
      camera.position.set(0, -7, 7);
      camera.lookAt(0, 0, 0);
      this.camera = camera;

      const renderer = new THREE.WebGLRenderer({
        antialias: true,
        autoSize: true,
      });
      renderer.setSize(window.innerWidth, this.contentHeight);
      renderer.setAnimationLoop(() => {
        renderer.render(scene, camera);
      });

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
    addMesh(tokenId, vertices, edges, faces, jsonData) {
      const positions = new THREE.Float32BufferAttribute(vertices, 3);
      const meshgeometry = new THREE.BufferGeometry();
      meshgeometry.setAttribute("position", positions);
      meshgeometry.setIndex(faces);
      const meshmaterial = new THREE.MeshBasicMaterial({
        color: 0xcccccc,
        side: THREE.DoubleSide,
      });
      const mesh = new THREE.Mesh(meshgeometry, meshmaterial);
      mesh.userData.interactive = true;
      mesh.userData.data = jsonData;
      mesh.userData.data.tokenId = tokenId;
      this.selectableMeshes.push(mesh);

      const linegeometry = new THREE.BufferGeometry();
      linegeometry.setAttribute("position", positions);
      linegeometry.setIndex(edges);
      const linematerial = new THREE.LineBasicMaterial({ color: 0x888888 });
      const line = new THREE.LineSegments(linegeometry, linematerial);

      scene.add(mesh);
      scene.add(line);
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
        mesh.material.color.set(0xff0000);
        event.target.style.cursor = "pointer";
      } else {
        this.selectableMeshes.forEach((mesh) => {
          mesh.material.color.set(0xcccccc);
        });
        event.target.style.cursor = "default";
      }
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
    boxToSubdividedMesh() {
      compas
        .boxToSubdividedMesh({ xsize: 1, ysize: 1, zsize: 1 })
        .then((response) => {
          this.addMesh(response.vertices, response.edges, response.faces);
        });
    },
    loadGemmaCurtain() {
      compas.loadGemmaCurtain().then((response) => {
        this.addMesh(
          0,
          response.vertices,
          response.edges,
          response.faces,
          gemmaCurtainJson
        );
      });
    },
    loadCooper() {
      compas.loadCooper().then((response) => {
        this.addMesh(
          1,
          response.vertices,
          response.edges,
          response.faces,
          cooperJson
        );
      });
    },
  },
  mounted() {
    this.initThree();
    this.addGrid();
  },
};
</script>
