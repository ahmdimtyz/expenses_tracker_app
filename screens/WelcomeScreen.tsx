import React, { useRef, useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  FlatList,
  StyleSheet,
  Dimensions,
  Animated,
  TouchableOpacity,
  Modal,
  TextInput,
  Button,
} from 'react-native';

const screenWidth = Dimensions.get('window').width;

const cards = [
  { id: '1', title: 'Card One' },
  { id: '2', title: 'Card Two' },
  { id: '3', title: 'Card Three' },
];

const transactions = [
  { id: 't1', date: '2025-07-01', desc: 'Coffee Shop', amount: '$4.20', status: 'Paid' },
  { id: 't2', date: '2025-07-02', desc: 'Groceries',   amount: '$32.50', status: 'Paid' },
  { id: 't3', date: '2025-07-03', desc: 'Electricity', amount: '$65.00', status: 'Due'  },
  // …more rows
];

export default function WelcomeScreen() {
    const scrollX = useRef(new Animated.Value(0)).current;
    const [modalVisible, setModalVisible] = useState(false);    

  return (
    <SafeAreaView style={styles.root}>
      {/* Carousel + Dots */}
      <View style={styles.carouselContainer}>
        <Animated.FlatList
          data={cards}
          keyExtractor={item => item.id}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.carouselContent}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { x: scrollX } } }],
            { useNativeDriver: false }
          )}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.cardTitle}>{item.title}</Text>
            </View>
          )}
        />

        <View style={styles.dotsContainer}>
          {cards.map((_, index) => {
            const inputRange = [
              (index - 1) * screenWidth,
              index * screenWidth,
              (index + 1) * screenWidth,
            ];
            const opacity = scrollX.interpolate({
              inputRange,
              outputRange: [0.3, 1, 0.3],
              extrapolate: 'clamp',
            });
            return <Animated.View key={index} style={[styles.dot, { opacity }]} />;
          })}
        </View>
      </View>

      {/* Transaction History (fills remaining space) */}
      <View style={styles.tableContainer}>
        <View style={styles.tableHeader}>
          <Text style={styles.headerCell}>Date</Text>
          <Text style={styles.headerCell}>Description</Text>
          <Text style={styles.headerCell}>Amount</Text>
          <Text style={styles.headerCell}>Status</Text>
        </View>
        <FlatList
          data={transactions}
          keyExtractor={item => item.id}
          style={styles.table}
          contentContainerStyle={styles.tableContent}
          renderItem={({ item }) => (
            <View style={styles.tableRow}>
              <Text style={styles.cell}>{item.date}</Text>
              <Text style={styles.cell}>{item.desc}</Text>
              <Text style={styles.cell}>{item.amount}</Text>
              <Text style={styles.cell}>{item.status}</Text>
            </View>
          )}
          ListEmptyComponent={<Text style={styles.emptyText}>No transactions to show</Text>}
        />
      </View>

      {/* 3️⃣ Floating “+” Button */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>

      {/* 4️⃣ Overlay Form Modal */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>New Transaction</Text>
            <TextInput
              style={styles.input}
              placeholder="Description"
            />
            <TextInput
              style={styles.input}
              placeholder="Amount"
              keyboardType="numeric"
            />
            <View style={styles.modalButtons}>
              <Button title="Cancel" onPress={() => setModalVisible(false)} />
              <Button title="Save"   onPress={() => {/* save logic */}} />
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#fff',
  },

  carouselContainer: {
    // only as tall as its content
  },
  carouselContent: {
    paddingVertical: 20,
  },

  card: {
    width: screenWidth * 0.8,
    height: 200,
    marginHorizontal: screenWidth * 0.1,
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'visible',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },

  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 8,
  },
  dot: {
    height: 8,
    width: 8,
    borderRadius: 4,
    backgroundColor: '#333',
    marginHorizontal: 4,
  },

  tableContainer: {
    flex: 1,                  // ← fill remaining space
    backgroundColor: '#f0f4f8',
    borderRadius: 12,
    marginHorizontal: 0,
    marginTop: 20,
    paddingVertical: 0,
    paddingHorizontal: 0,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#e0e7ef',
    paddingVertical: 8,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  headerCell: {
    flex: 1,
    fontWeight: 'bold',
    textAlign: 'center',
  },

  table: {
    flex: 1,                // ← let the list grow inside its container
    marginTop: 4,
  },
  tableContent: {
    paddingBottom: 20,
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccd6e0',
  },
  cell: {
    flex: 1,
    textAlign: 'center',
  },

  emptyText: {
    textAlign: 'center',
    color: '#666',
    marginTop: 20,
  },

  fab: {
    position: 'absolute',
    bottom: 20,            // a bit above the tab bar
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,          // Android shadow
    shadowColor: '#000',   // iOS shadow
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  fabText: {
    fontSize: 32,
    color: '#fff',
    lineHeight: 32,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',  // dim background
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 8,
    height: 40,
    marginBottom: 12,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
