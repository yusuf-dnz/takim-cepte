import { View, Text } from "react-native";
import React, { useContext } from "react";
import { IconButton, TextInput } from "react-native-paper";
import { ThemeContext, theme } from "../Theme";
import SelectDropdown from "react-native-select-dropdown";

export function Football_Form() {
  const formData = {
    height: null,
    weight: null,
    position: null,
  };

  const positions = ["Kaleci", "Defans", "OrtaSaha", "Hücum"];
  return (
    <View
      style={{
        display: "flex",
        alignItems: "center",
      }}
    >
      <Text style={{ color: theme.color, textAlign: "center" }}>
        Etkileşim artırmak için detay girin
      </Text>

      <TextInput
        maxLength={3}
        style={{ width: "50%" }}
        mode="outlined"
        keyboardType="numeric"
        placeholder="Kilo"
        right={<TextInput.Affix  text="kg" />}
        onChangeText={(num) => {
          (formData.weight = num), console.log("hey");
        }}
        value={formData.weight}
      />
      <TextInput
        maxLength={3}
        style={{ width: "50%" }}
        mode="outlined"
        keyboardType="numeric"
        placeholder="Boy"
        right={<TextInput.Affix  text="cm" />}
        onChangeText={(num) => {
            (formData.height = num);
          }}
        value={formData.height}

      />

      <SelectDropdown
        defaultButtonText="Mevki seçebilirsin!"
        buttonStyle={{ width: "100%", marginVertical: 5 }}
        data={positions}
        onSelect={(selectedItem, index) => {
          (formData.position = selectedItem), console.log(formData);
        }}
        buttonTextAfterSelection={(selectedItem, index) => {
          return selectedItem;
        }}
        rowTextForSelection={(item, index) => {
          return item;
        }}
      />
      <IconButton
        style={{}}
        icon="check"
        iconColor={theme.color}
        onPress={() => console.log("press")}
      />
    </View>
  );
}

export function Basketball_Form() {
  const positions = ["Şutör Guard", "Küçük Forvet", "Büyük Forvet", "Pivot "];
  return (
    <>
      <Text style={{ color: theme.color, textAlign: "center" }}>
        Etkileşim artırmak için detay girin
      </Text>

      <TextInput
        maxLength={3}
        style={{}}
        mode="outlined"
        keyboardType="numeric"
        label="Kilo"
        right={<TextInput.Affix text="kg" />}
      />
      <TextInput
        maxLength={3}
        style={{}}
        mode="outlined"
        keyboardType="numeric"
        label="Boy"
        right={<TextInput.Affix text="cm" />}
      />

      <SelectDropdown
        defaultButtonText="Mevki seçebilirsin!"
        buttonStyle={{ width: "100%", marginVertical: 5 }}
        data={positions}
        onSelect={(selectedItem, index) => {}}
        buttonTextAfterSelection={(selectedItem, index) => {
          return selectedItem;
        }}
        rowTextForSelection={(item, index) => {
          return item;
        }}
      />
    </>
  );
}

export function Valorant_Form() {
  const agents = [
    "Brimstone",
    "Viper",
    "Omen",
    "Killjoy",
    "Cypher",
    "Sova",
    "Jett",
    "Reyna",
    "Raze",
  ];
  const positions = ["Düellocu", "Gözcü", "Kontrol Uzmanı", "Öncü"];
  return (
    <>
      <Text style={{ color: theme.color, textAlign: "center" }}>
        Etkileşim artırmak için detay girin
      </Text>

      <SelectDropdown
        buttonStyle={{ width: "100%", marginVertical: 5 }}
        defaultButtonText="Main ajanın..."
        data={agents}
        onSelect={(selectedItem, index) => {}}
        buttonTextAfterSelection={(selectedItem, index) => {
          return selectedItem;
        }}
        rowTextForSelection={(item, index) => {
          return item;
        }}
      />

      <SelectDropdown
        buttonStyle={{ width: "100%", marginVertical: 5 }}
        defaultButtonText="Mevki..."
        data={positions}
        onSelect={(selectedItem, index) => {}}
        buttonTextAfterSelection={(selectedItem, index) => {
          return selectedItem;
        }}
        rowTextForSelection={(item, index) => {
          return item;
        }}
      />
    </>
  );
}

export function LOL_Form() {
  const positions = [
    "Üst koridor",
    "Ormancı",
    "Orta koridor",
    "Nişancı",
    "Destek",
  ];
  return (
    <>
      <Text style={{ color: theme.color, textAlign: "center" }}>
        Etkileşim artırmak için detay girin
      </Text>

      <SelectDropdown
        buttonStyle={{ width: "100%", marginVertical: 5 }}
        defaultButtonText="Mevki seçiniz"
        data={positions}
        onSelect={(selectedItem, index) => {}}
        buttonTextAfterSelection={(selectedItem, index) => {
          return selectedItem;
        }}
        rowTextForSelection={(item, index) => {
          return item;
        }}
      />
    </>
  );
}

export function CS2_Form() {
  const positions = [
    "Game Leader (IGL)",
    "Supporter",
    "Entry",
    "Lurker",
    "Flex",
    "AWP Player",
  ];
  return (
    <>
      <SelectDropdown
        buttonStyle={{ width: "100%", marginVertical: 5 }}
        defaultButtonText="Mevki..."
        data={positions}
        onSelect={(selectedItem, index) => {
          console.log(selectedItem, index);
        }}
        buttonTextAfterSelection={(selectedItem, index) => {
          return selectedItem;
        }}
        rowTextForSelection={(item, index) => {
          return item;
        }}
      />
    </>
  );
}

export default function EventForms() {
  const Theme = useContext(ThemeContext);
}
