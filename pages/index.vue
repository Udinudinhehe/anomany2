<template>
  <div class="max-w-6xl mx-auto p-6">
    <h2 class="text-xl font-bold mb-4">Auto Generate Caption</h2>
    <hr class="mb-4" />

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <!-- KIRI -->
      <div>
        <!-- Textarea 1 -->
        <label for="text1" class="font-semibold block mb-1"
          >01. Input Event Dashboard</label
        >
        <Textarea
          v-model="inputDashboard"
          ref="textareaRef"
          @input="resize"
          class="w-full border p-2 rounded mb-4 font-sans overflow-hidden"
          placeholder="Masukkan Dashboard Event"
          id="dashboardId"
        />

        <!-- Anomaly Input Section -->
        <h3 class="font-semibold mb-2">02. Input Manual Jam Anomaly</h3>

        <div class="flex gap-4">
          <div class="flex-1">
            <label class="block mb-1">First Time:</label>
            <Input v-model="firstTime" placeholder="Misal: 02.00" />
          </div>
          <div class="flex-1">
            <label class="block mb-1">Last Time:</label>
            <Input v-model="lastTime" placeholder="Misal: 18.00" />
          </div>
        </div>

        <label class="block mb-1">Pilih Jam Anomaly:</label>
        <Select v-model="jamAnomaly">
          <SelectTrigger class="w-full mb-2">
            <SelectValue placeholder="Masukkan Jam Anomaly" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Jam Anomaly</SelectLabel>
              <SelectItem value="16:00 - 18:00">16:00 - 18:00</SelectItem>
              <SelectItem value="18:00 - 20:00">18:00 - 20:00</SelectItem>
              <SelectItem value="22:00 - 24:00">22:00 - 24:00</SelectItem>
              <SelectItem value="24:00 - 00:00">24:00 - 00:00</SelectItem>
              <SelectItem value="00:00 - 02:00">00:00 - 02:00</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>

       
      </div>

      <!-- KANAN -->
      <div>
        <!-- Textarea 2 -->
        <label for="text2" class="font-semibold block mb-1"
          >03. Input Security Event</label
        >
        <Textarea
          v-model="inputDetail"
          rows="10"
          class="w-full border p-2 rounded mb-4 font-sans"
          placeholder="Masukkan Security Event"
          id="text2"
        />

        <!-- Textarea 3 -->
        <label for="text3" class="font-semibold block mb-1"
          >04. Input IP Reputation Intelligence</label
        >
        <Textarea
          v-model="inputIPReputation"
          rows="10"
          class="w-full border p-2 rounded mb-4 font-sans"
          placeholder="Masukkan Data IP Reputation Intelligence"
          id="text3"
        />

        <Alert v-if="showAlert" variant="destructive" class="mb-4">
          <AlertTitle>Form Tidak Lengkap</AlertTitle>
          <AlertDescription>
            Mohon lengkapi semua input yang diperlukan sebelum generate caption.
          </AlertDescription>
        </Alert>

        <Button
          variant="outline"
          :disabled="!isFormValid"
          :class="[
            'transition-colors',
            isFormValid
              ? 'bg-blue-600 text-white hover:bg-blue-700 cursor-pointer'
              : 'bg-gray-400 text-white cursor-not-allowed',
          ]"
          @click="handleGenerateClick"
        >
          <Send /> Generate
        </Button>
        <Button
          variant="destructive"
          class="mt-2 mx-3 cursor-pointer"
          @click="handleResetForm"
        >
          <Trash /> Reset Form
        </Button>
      </div>
    </div>

    <!-- Caption Result -->
    <div class="mt-3">
      <div class="flex items-center gap-2">
        <MessageCircleMore stroke-width="1" />
        <h1 class="font-bold my-2">Hasil Generate</h1>
      </div>
    </div>
    <hr />
    <div
      v-if="caption1 || caption2 || anomalyCaption || caption3"
      class="mt-8 space-y-4"
    >
      <div
        v-if="anomalyCaption"
        class="p-4 border rounded bg-yellow-100 leading-relaxed"
      >
        <h2 class="font-semibold mb-2">Caption 1:</h2>
        <Button
          variant="outline"
          size="sm"
          @click="copyToClipboard(anomalyCaption)"
        >
          Copy
        </Button>
        <p
          v-for="(line, index) in anomalyCaption.split('\n')"
          :key="index"
          class="mb-1"
        >
          {{ line }}
        </p>
      </div>

      <div
        v-if="caption1"
        class="p-4 border rounded bg-gray-100 leading-relaxed"
      >
        <h2 class="font-semibold mb-2">Caption 2:</h2>
        <Button variant="outline" size="sm" @click="copyToClipboard(caption1)">
          Copy
        </Button>
        <p>{{ caption1 }}</p>
      </div>

      <div
        v-if="caption2"
        class="p-4 border rounded bg-gray-100 leading-relaxed"
      >
        <h2 class="font-semibold mb-2">Caption 3:</h2>
        <div class="flex items-center">
          <Button
            variant="outline"
            size="sm"
            @click="copyToClipboard(caption2)"
          >
            Copy
          </Button>
        </div>
        <p
          v-for="(line, index) in caption2.split('\n')"
          :key="index"
          class="mb-1"
        >
          {{ line }}
        </p>
      </div>

      <div
        v-if="caption3"
        class="p-4 border rounded bg-gray-100 leading-relaxed"
      >
        <h2 class="font-semibold mb-2">Caption 4:</h2>
        <Button
          variant="outline"
          size="sm"
          class="cursor-pointer"
          @click="copyToClipboard(caption3)"
        >
          Copy
        </Button>
        <p
          v-for="(line, index) in caption3.split('\n')"
          :key="index"
          class="mb-1"
        >
          {{ line }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "vue-sonner";
import { MessageCircleMore } from "lucide-vue-next";
import { Trash } from "lucide-vue-next";
import { Send } from "lucide-vue-next";

import "vue-sonner/style.css";
import "zone.js";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const inputDashboard = ref("");
const inputDetail = ref("");
const inputIPReputation = ref("");
const caption1 = ref("");
const caption2 = ref("");
const caption3 = ref("");
const anomalyCaption = ref("");
const jamAnomaly = ref("");
const firstTime = ref("");
const lastTime = ref("");
const showAlert = ref(false);
const textareaRef = ref(null);

const resize = () => {
  const el = textareaRef.value;
  if (el) {
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  }
};
// Form Valid
const isFormValid = computed(() => {
  return (
    inputDashboard.value.trim() !== "" &&
    inputDetail.value.trim() !== "" &&
    jamAnomaly.value.trim() !== "" &&
    firstTime.value.trim() !== "" &&
    lastTime.value.trim() !== ""
  );
});

const formatDate = (str) => {
  const date = new Date(str);
  if (isNaN(date.getTime())) return str;
  return date.toLocaleString("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
};
const handleGenerateClick = () => {
  if (!isFormValid.value) {
    showAlert.value = true;
    return;
  }
  showAlert.value = false;
  generateCaption();
};

const generateCaption = () => {
  caption1.value = "";
  caption2.value = "";
  caption3.value = "";
  anomalyCaption.value = "";

  const lines1 = inputDashboard.value.trim().split("\n");
  const attackData = [];
  for (let i = 0; i < lines1.length; i += 2) {
    const attackLine = lines1[i]?.trim();
    const actionLine = lines1[i + 1]?.trim() || "";
    if (attackLine) {
      const [name, countStr] = attackLine.split("\t");
      const count = parseInt(countStr);
      if (!isNaN(count) && count > 0) {
        attackData.push({ name: name.trim(), count, action: actionLine });
      }
    }
  }

  if (attackData.length > 0) {
    const attackEvents = attackData
      .map((item) => `*${item.name}* sebanyak ${item.count} sessions`)
      .join(", ");
    caption1.value = `Setelah dilakukan pengecekan pada dashboard WAF Policies dan Security Rules, insiden anomali tersebut memicu WAF dengan jenis Incident ${attackEvents}.`;
  }

  const lines2 = inputDetail.value.trim().split("\n");
  const detailData = {};
  const eventTypes = [];

  for (let i = 0; i < lines2.length; i++) {
    const line = lines2[i].trim();
    const match = line.match(/^(.+?)\s*\((\d+)\)$/);
    if (match) {
      const [, name, countStr] = match;
      const count = parseInt(countStr);
      if (!isNaN(count) && count > 0) {
        eventTypes.push(name.trim());
      }
    } else {
      const key = line;
      const value = lines2[i + 1]?.trim();
      if (key && value) {
        detailData[key] = value;
        i++;
      }
    }
  }

  if (eventTypes.length > 0) {
    caption2.value = `Berikut adalah Detail Events dari Type *${eventTypes.join(
      "*, *"
    )}* tersebut sebagai berikut :\n\nClient Type : ${
      detailData["Client Type"] || "-"
    }\nClient App : ${detailData["Client App"] || "-"}\nMethod : ${
      detailData["Method"] || "-"
    }\nTime : ${
      detailData["Time"] ? formatDate(detailData["Time"]) : "-"
    }\nCountry : ${detailData["Country"] || "-"}\nSource IP : *${
      detailData["Source IP"] || "-"
    }*\nStatus : Blocked`;
  }

  const ipReputationLines = inputIPReputation.value.trim().split("\n");
  const ipRepData = {};
  for (let i = 0; i < ipReputationLines.length; i++) {
    const key = ipReputationLines[i].trim().replace(":", "");
    const value = ipReputationLines[i + 1]?.trim();
    if (key && value) {
      ipRepData[key] = value;
      i++;
    }
  }

  if (
    Object.keys(ipRepData).length > 0 &&
    detailData["Source IP"] &&
    eventTypes.length > 0
  ) {
    const country = ipRepData["Country"] || "-";
    const city = ipRepData["City"] || "-";
    const asn = ipRepData["ASN"] || "-";
    const riskScore = ipRepData["Risk score"] || "-";
    caption3.value = `Informasi dari Source IP *${
      detailData["Source IP"]
    }* yang telah melakukan serangan *${eventTypes.join(
      ", "
    )}* berdasarkan IP Reputation Intelligence:\n\nCountry : ${country}\nCity : ${city}\nASN/ISP : ${asn}\nRisk Score : ${riskScore}`;
  }

  const rawDate = detailData["Time"] ? new Date(detailData["Time"]) : null;
  const tanggal = rawDate
    ? rawDate.toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      })
    : "-";
  const domain = detailData["Website"] || "-";

  if (jamAnomaly.value && firstTime.value && lastTime.value && domain !== "-") {
    const cleanDomain = domain.replace(/\s*\(.*?\)/g, "").trim();
    anomalyCaption.value = `\u26a0\ufe0fANOMALY TRAFFIC ALERT NOTIFICATION\u26a0\ufe0f\n\nDomain/Website : *${cleanDomain}*\n\nHari & Tanggal : *${tanggal}*\n\nJam : *${jamAnomaly.value}*\n\nUpdate alert notification anomaly traffic, pada jam *${firstTime.value} - ${lastTime.value} WIB* telah terjadi peningkatan blocking traffic requests overtime yang terjadi di domain *${cleanDomain}*.`;
  }
};
// Copy Caption
const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    toast.success("Caption Berhasil di Salin Ke Clipboard.");
  } catch (error) {
    toast.error("Gagal Menyalin Caption");
    console.error(error);
  }
};
//Reset Form
const handleResetForm = () => {
  inputDashboard.value = "";
  inputDetail.value = "";
  inputIPReputation.value = "";
  caption1.value = "";
  caption2.value = "";
  caption3.value = "";
  anomalyCaption.value = "";
  jamAnomaly.value = "";
  firstTime.value = "";
  lastTime.value = "";
  showAlert.value = false;

  // Auto resize textarea jika diperlukan
  if (textareaRef.value) {
    textareaRef.value.style.height = "auto";
  }

  toast.success("Form berhasil di-reset!");
};
</script>
