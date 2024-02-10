<script setup>
import { onMounted, ref } from 'vue';
import { fetchPlayers } from './utils/fetchPlayers';
const players = ref([]);
const gambler = ref({});
let tableCredit = ref(0);
let customBid = ref(0);

const dev = () => {
  const arr = [
    {
      id: 1,
      name: 'Player 1',
      credit: 100,
    },
    {
      id: 2,
      name: 'Player 2',
      credit: 100,
    },
    {
      id: 3,
      name: 'Player 3',
      credit: 100,
    },
    {
      id: 4,
      name: 'Player 4',
      credit: 100,
    },
    {
      id: 5,
      name: 'Player 5',
      credit: 100,
    },
    {
      id: 6,
      name: 'Player 6',
      credit: 100,
    },
  ];
  players.value = arr;
  localStorage.setItem('players', JSON.stringify(arr));

  tableCredit.value = 0;
  localStorage.setItem('tableCredit', 0);
};

const clear = () => {
  players.value = [];
  localStorage.removeItem('players');
  tableCredit.value = 0;
  localStorage.removeItem('tableCredit');
};

const addGambler = () => {
  if (gambler.value.name) {
    players.value.push({
      id: players.value.length + 1,
      name: gambler.value.name,
      credit: gambler.value.credit || 50,
    });
    localStorage.setItem('players', JSON.stringify(players.value));
    gambler.value = {};
  }
};

const uncheckAll = () => {
  const checkboxes = document.querySelectorAll('input[type="checkbox"]');
  checkboxes.forEach((checkbox) => {
    checkbox.checked = false;
  });
};

const bid = (x) => {
  const checkboxes = document.querySelectorAll(
    'input[type="checkbox"]:checked'
  );
  const ids = Array.from(checkboxes).map((checkbox) => checkbox.id);
  const playersArr = players.value;
  const total = ids.length * x;
  tableCredit.value += total;
  localStorage.setItem('tableCredit', tableCredit.value);
  playersArr.forEach((player) => {
    if (ids.includes(player.id.toString())) {
      player.credit -= x;
    }
  });
  customBid.value = 0;
  players.value = playersArr;
  localStorage.setItem('players', JSON.stringify(playersArr));
  uncheckAll();
};

const reward = () => {
  const checkboxes = document.querySelectorAll(
    'input[type="checkbox"]:checked'
  );
  const ids = Array.from(checkboxes).map((checkbox) => checkbox.id);
  const playersArr = players.value;
  const total = tableCredit.value;
  const reward = total / ids.length;
  playersArr.forEach((player) => {
    if (ids.includes(player.id.toString())) {
      player.credit += reward;
    }
  });
  tableCredit.value = 0;
  localStorage.setItem('tableCredit', 0);
  players.value = playersArr;
  localStorage.setItem('players', JSON.stringify(playersArr));
  document.getElementById('toClear').value = '';
  customBid.value = 0;
  uncheckAll();
};

onMounted(() => {
  fetchPlayers().then(player => {
    players.value = player;
  })
});
</script>

<template>
  <div class="flex flex-col items-center m-4">
    <!-- DEV ONLY -->
    <div class="flex gap-1 absolute right-2 bottom-2">

      <button class="btn bg-red-500 text-white btn-sm" @click="dev">dev</button>
      <button class="btn bg-red-500 text-white btn-sm" @click="clear">
        clear
      </button>
    </div>
    <!-- Header -->
    <div class="flex items-center justify-around w-1/3">
      <h1 class="text-5xl font-bold text-gray-200">Life Mistake Calculator</h1>
      <div class="flex flex-col w-full">
        <button class="btn bg-primary-content text-primary text-2xl btn-md" onclick="addGambler.showModal()">
          Add Gambler
        </button>
        <div id="select-players">
          <select class="select mt-2 select-bordered w-full max-w-xs">
            <option disabled selected>Avalible Players</option>
            <option v-for="(player, id) in players" :key="id">{{ player.name }}</option>
          </select>
        </div>
      </div>
      <dialog id="addGambler" class="modal">
        <div class="modal-box flex flex-col gap-2">
          <h3 class="font-bold text-xl">Inser name and credits of failure!</h3>
          <input type="text" class="input input-primary text-white font-semibold" placeholder="Name"
            v-model="gambler.name" />
          <input type="number" class="input input-primary text-white font-semibold"
            placeholder="Credit (default: 50 credits)" v-model="gambler.credit" />
          <div class="modal-action">
            <form method="dialog">
              <button class="btn btn-primary" @click="addGambler">Add</button>
            </form>
          </div>
        </div>

        <form method="dialog" class="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </div>

    <!-- Content -->
    <div v-if="players.length > 0" class="flex flex-col items-center pt-12">
      <!-- Players -->
      <div class="flex gap-4">
        <div class="flex flex-col gap-2 items-center">
          <h2 class="text-4xl font-bold pb-2">Players List:</h2>
          <div class="flex flex-col gap-2">
            <div v-for="player in players" :key="player.id" class="flex gap-2 items-center">
              <input type="checkbox" class="checkbox checkbox-error" :id="player.id" />
              <div class="text-2xl font-bold">
                <p>
                  Name:
                  <span class="text-primary font-semibold">{{
                    player.name
                  }}</span>
                </p>
              </div>
              <div class="text-2xl font-bold">
                <p>
                  With
                  <span class="text-secondary font-semibold">{{ player.credit }} Credit(s)</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- Table Credits -->
      <div class="flex flex-col gap-2 items-center pt-6">
        <h2 class="text-4xl font-bold">
          Table Credits:
          <span class="text-secondary">{{ tableCredit }} credit(s)</span>
        </h2>
      </div>
      <!-- Controller -->
      <div class="pt-6 flex gap-2 items-center">
        <div class="flex flex-col gap-2">
          <button class="btn bg-primary-content text-primary text-2xl btn-lg" @click="bid(1)">
            <p>Bid <span class="text-secondary">x1</span> credits</p>
          </button>
          <button class="btn bg-primary-content text-primary text-2xl btn-lg" @click="bid(3)">
            <p>Bid <span class="text-secondary">x3</span> credits</p>
          </button>
          <button class="btn bg-primary-content text-primary text-2xl btn-lg" @click="bid(5)">
            <p>Bid <span class="text-secondary">x5</span> credits</p>
          </button>
        </div>
        <div class="flex flex-col gap-2">
          <button class="btn bg-primary-content text-primary text-2xl btn-lg" onclick="customBid.showModal()">
            <p>Bid <span class="text-secondary">Custom</span> Credit</p>
          </button>
          <dialog id="customBid" class="modal">
            <div class="modal-box flex flex-col gap-2">
              <h3 class="font-bold text-lg">Enter Amout of bid</h3>
              <input type="number" class="input input-primary text-white font-semibold" v-model="customBid"
                id="toClear" />
              <div class="modal-action">
                <form method="dialog">
                  <button class="btn btn-primary" @click="bid(customBid)">
                    Add
                  </button>
                </form>
              </div>
            </div>
            <form method="dialog" class="modal-backdrop">
              <button>close</button>
            </form>
          </dialog>
          <button class="btn bg-accent text-primary-content text-2xl btn-lg" @click="reward">
            ROUND END
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
* {
  transition: all ease-in-out 0.3s;
}
</style>
