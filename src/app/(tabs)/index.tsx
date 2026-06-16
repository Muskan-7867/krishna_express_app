import { ThemedView } from "@/components/themed-view";
import { useTheme } from "@/hooks/use-theme";
import Ionicons from "@react-native-vector-icons/ionicons";
import {
  CameraType,
  CameraView,
  useCameraPermissions,
} from "expo-camera";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

export default function IncomingScreen() {
  const theme = useTheme();

  const themeStyles = {
    input: {
      backgroundColor: theme.backgroundElement,
      color: theme.text,
      borderColor: theme.backgroundSelected,
    },
    card: {
      backgroundColor: theme.backgroundElement,
    },
    statusCard: {
      backgroundColor: theme.backgroundSelected,
    },
    text: {
      color: theme.text,
    },
    textSecondary: {
      color: theme.textSecondary,
    },
  };

  const [facing] = useState<CameraType>("back");
  const [permission, requestPermission] = useCameraPermissions();

  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [scanned, setScanned] = useState(false);

  const [serialNumber, setSerialNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [shipmentData, setShipmentData] = useState<any>(null);

  const [formData, setFormData] = useState({
    trackingId: "",
    source: "",
    destination: "",
    sender: "",
    senderMobile: "",
    receiver: "",
    receiverMobile: "",
    createdAt: "",
    updatedAt: "",
  });

  const openCamera = async () => {
    if (!permission?.granted) {
      const result = await requestPermission();
      if (!result.granted) return;
    }

    setScanned(false);
    setIsCameraOpen(true);
  };

  const fetchShipmentData = async (barcode: string) => {
    try {
      setLoading(true);

      const response = await fetch(
        `https://apis-hubops.innofulfill.com/tracking/v2/${barcode}`
      );

      const data = await response.json();

      setShipmentData(data);

      setFormData({
        trackingId: data.orderInformation.trackingId || "",
        source: `${data.orderInformation.sourceLocation.city}, ${data.orderInformation.sourceLocation.state}, ${data.orderInformation.sourceLocation.pincode}`,
        destination: `${data.orderInformation.destinationLocation.city}, ${data.orderInformation.destinationLocation.state}, ${data.orderInformation.destinationLocation.pincode}`,
        sender:
          data.orderInformation.senderDetails.sender_name || "",
        senderMobile:
          data.orderInformation.senderDetails.sender_mobile || "",
        receiver:
          data.orderInformation.receiverDetails.receiver_name || "",
        receiverMobile:
          data.orderInformation.receiverDetails.receiver_mobile || "",
        createdAt: data.orderInformation.createdAt || "",
        updatedAt: data.orderInformation.updatedAt || "",
      });
    } catch (error) {
      Alert.alert("Error", "Failed to fetch shipment data");
    } finally {
      setLoading(false);
    }
  };

  const handleBarcodeScanned = ({ data }: any) => {
    if (scanned) return;

    setScanned(true);
    setIsCameraOpen(false);

    setSerialNumber(data);

    fetchShipmentData(data);
  };

  const handleManualSearch = () => {
    if (!serialNumber.trim()) {
      Alert.alert("Error", "Please enter serial number");
      return;
    }

    fetchShipmentData(serialNumber);
  };

  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
        {/* Manual Entry */}
        <Text style={[styles.label, themeStyles.text]}>Enter Serial Number</Text>

        <TextInput
          style={[styles.input, themeStyles.input]}
          placeholder="Enter serial number"
          placeholderTextColor={theme.textSecondary}
          value={serialNumber}
          onChangeText={setSerialNumber}
        />

        <View style={styles.buttonRow}>
          <Pressable
            style={styles.searchBtn}
            onPress={handleManualSearch}
          >
            <Text style={styles.btnText}>Search</Text>
          </Pressable>
        </View>

        {/* Scanner */}
        {isCameraOpen && (
          <CameraView
            style={styles.camera}
            facing={facing}
            barcodeScannerSettings={{
              barcodeTypes: [
                "qr",
                "ean13",
                "ean8",
                "code128",
                "code39",
                "upc_a",
                "upc_e",
              ],
            }}
            onBarcodeScanned={handleBarcodeScanned}
          >
            <View style={styles.overlay}>
              <Pressable
                onPress={() => setIsCameraOpen(false)}
                style={styles.closeBtn}
              >
                <Ionicons name="close" size={24} color="#fff" />
              </Pressable>
            </View>
          </CameraView>
        )}

        {/* Loading */}
        {loading && (
          <ActivityIndicator
            size="large"
            style={{ marginTop: 20 }}
          />
        )}

        {/* Shipment Details Form */}
        {shipmentData && (
          <View style={[styles.card, themeStyles.card]}>
            <Text style={[styles.title, themeStyles.text]}>Shipment Details</Text>

            <View style={styles.field}>
              <Text style={[styles.fieldLabel, themeStyles.text]}>Tracking ID</Text>
              <TextInput
                style={[styles.inputField, themeStyles.input]}
                placeholderTextColor={theme.textSecondary}
                value={formData.trackingId}
                onChangeText={(text) =>
                  setFormData({ ...formData, trackingId: text })
                }
              />
            </View>

            <View style={styles.field}>
              <Text style={[styles.fieldLabel, themeStyles.text]}>Source</Text>
              <TextInput
                style={[styles.inputField, themeStyles.input]}
                placeholderTextColor={theme.textSecondary}
                value={formData.source}
                multiline
                onChangeText={(text) =>
                  setFormData({ ...formData, source: text })
                }
              />
            </View>

            <View style={styles.field}>
              <Text style={[styles.fieldLabel, themeStyles.text]}>Destination</Text>
              <TextInput
                style={[styles.inputField, themeStyles.input]}
                placeholderTextColor={theme.textSecondary}
                value={formData.destination}
                multiline
                onChangeText={(text) =>
                  setFormData({ ...formData, destination: text })
                }
              />
            </View>

            <View style={styles.field}>
              <Text style={[styles.fieldLabel, themeStyles.text]}>Sender</Text>
              <TextInput
                style={[styles.inputField, themeStyles.input]}
                placeholderTextColor={theme.textSecondary}
                value={formData.sender}
                onChangeText={(text) =>
                  setFormData({ ...formData, sender: text })
                }
              />
            </View>

            <View style={styles.field}>
              <Text style={[styles.fieldLabel, themeStyles.text]}>Sender Mobile</Text>
              <TextInput
                style={[styles.inputField, themeStyles.input]}
                placeholderTextColor={theme.textSecondary}
                value={formData.senderMobile}
                onChangeText={(text) =>
                  setFormData({ ...formData, senderMobile: text })
                }
              />
            </View>

            <View style={styles.field}>
              <Text style={[styles.fieldLabel, themeStyles.text]}>Receiver</Text>
              <TextInput
                style={[styles.inputField, themeStyles.input]}
                placeholderTextColor={theme.textSecondary}
                value={formData.receiver}
                onChangeText={(text) =>
                  setFormData({ ...formData, receiver: text })
                }
              />
            </View>

            <View style={styles.field}>
              <Text style={[styles.fieldLabel, themeStyles.text]}>Receiver Mobile</Text>
              <TextInput
                style={[styles.inputField, themeStyles.input]}
                placeholderTextColor={theme.textSecondary}
                value={formData.receiverMobile}
                onChangeText={(text) =>
                  setFormData({ ...formData, receiverMobile: text })
                }
              />
            </View>

            <View style={styles.field}>
              <Text style={[styles.fieldLabel, themeStyles.text]}>Created At</Text>
              <TextInput
                style={[styles.inputField, themeStyles.input]}
                placeholderTextColor={theme.textSecondary}
                value={formData.createdAt}
                onChangeText={(text) =>
                  setFormData({ ...formData, createdAt: text })
                }
              />
            </View>

            <View style={styles.field}>
              <Text style={[styles.fieldLabel, themeStyles.text]}>Updated At</Text>
              <TextInput
                style={[styles.inputField, themeStyles.input]}
                placeholderTextColor={theme.textSecondary}
                value={formData.updatedAt}
                onChangeText={(text) =>
                  setFormData({ ...formData, updatedAt: text })
                }
              />
            </View>

            <Text style={[styles.statusHeading, themeStyles.text]}>
              Shipment Status History
            </Text>

            {shipmentData.statuses?.map(
              (status: any, index: number) => (
                <View key={index} style={[styles.statusCard]}>
                  <Text style={[styles.statusText, themeStyles.text]}>
                    Status: {status.status}
                  </Text>

                  <Text style={[styles.statusText, themeStyles.text]}>
                    Location: {status.location}
                  </Text>

                  <Text style={[styles.statusText, themeStyles.text]}>
                    Category: {status.category}
                  </Text>

                  <Text style={[styles.statusText, themeStyles.text]}>
                    Description: {status.subcategory}
                  </Text>

                  <Text style={[styles.statusDate, themeStyles.textSecondary]}>
                    {new Date(
                      status.createdAt
                    ).toLocaleString()}
                  </Text>
                </View>
              )
            )}
          </View>
        )}
      </ScrollView>

      {!isCameraOpen && (
        <Pressable
          style={styles.fab}
          onPress={openCamera}
        >
          <Ionicons name="camera" size={28} color="#fff" />
        </Pressable>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,

  },

  scrollContainer: {
    padding: 16,
    paddingBottom: 100,
  },

  label: {
    fontSize: 16,
    marginBottom: 8,
    fontWeight: "600",
  },

  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 50,
    backgroundColor: "#fff"
  },

  buttonRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 12,
  },

  searchBtn: {
    flex: 1,
    height: 50,
    backgroundColor: "#2563eb",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
  },

  btnText: {
    color: "#fff",
    fontWeight: "600",
  },

  fab: {
    position: "absolute",
    right: 20,
    bottom: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#16a34a",
    justifyContent: "center",
    alignItems: "center",

    zIndex: 10,
  },

  camera: {
    height: 350,
    marginTop: 20,
    borderRadius: 16,
    overflow: "hidden",
  },

  overlay: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "flex-end",
    padding: 16,
  },

  closeBtn: {
    backgroundColor: "red",
    padding: 10,
    borderRadius: 30,
  },

  card: {
    marginTop: 20,
    padding: 16,
    borderRadius: 12,
    backgroundColor: "#ffff",
  },

  title: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 10,
  },



  valueInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: "#fff",
    color: "#000",
  },

  field: {
    marginBottom: 12,
  },

  fieldLabel: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 6,
  },

  inputField: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: "#fff",
  },

  statusHeading: {
    marginTop: 20,
    marginBottom: 10,
    fontSize: 18,
    fontWeight: "700",
  },

  statusCard: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#d1d5db",

  },

  statusText: {
    fontSize: 14,
    marginBottom: 4,
  },

  statusDate: {
    marginTop: 6,
    color: "#6b7280",
    fontSize: 12,
  },
  statusTitle: {
    fontSize: 15,
    fontWeight: "700",
    marginBottom: 6,
  },
});