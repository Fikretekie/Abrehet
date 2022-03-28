/* eslint-disable react-native/no-inline-styles */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, {useState, useEffect} from 'react';
import {View, Text, SafeAreaView, ScrollView} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import {useRoute} from '@react-navigation/native';
import styles from './style';
import QuantitySelector from '../../components/QuantitySelector';
//import product from '../../data/product';
import Button from '../../components/Button';
import ImageCarousel from '../../components/ImageCarousel';
import * as types from '../../API';
import {
  API,
  graphqlOperation,
  sectionFooterSecondaryContent,
} from 'aws-amplify';
import * as queries from '../../graphql/queries';
import {useNavigation} from '@react-navigation/native';
import _ from 'lodash';

interface ProductItemDetails {
  id: string;
  title: string;
  description: string;
  image: string;
  images: string[];
  price: number;
  options: string[];
  ratings: number;
  oldPrice?: number;
  country: string;
}

const ProductScreen = ({Status}) => {
  const navigation = useNavigation();
  const [product, setProduct] = useState<ProductItemDetails>();
  const [selectedOption, setSelectedOption] = useState('black');
  const [quantity, setQuantity] = useState(1);
  const [text, setText] = useState('');

  //console.log('state: ' + JSON.stringify(navigation.getState()));

  useEffect(() => {
    //console.log("state: "+JSON.stringify(navigation.getState()));
    console.log("itemdetails: ");
    console.log(Status);
    console.log(globalThis.itemDetails[Status]);
    if (!globalThis.cart) {
      globalThis.cart = {};
    }
    const fetchProducts = async () => {
      //console.log("state: "+JSON.stringify(navigation.getState()));
      let getProducts = (await API.graphql(
        graphqlOperation(queries.getProducts, {id: globalThis.itemDetails[Status].id}),
      )) as {
        data: types.GetProductsQuery;
      };
      console.log("getproducts");
      console.log(getProducts);
      globalThis.category = getProducts.data.getProducts!.category;
      let parsed = _.pick(JSON.parse(getProducts.data.getProducts!.content), [
        'id',
        'title',
        'description',
        'image',
        'images',
        'price',
        'options',
        'oldPrice',
        'ratings',
        'title',
        'avgRating',
      ]);
      parsed.country = getProducts.data.getProducts!.country;
      parsed.images = parsed.images.split(',');
      parsed.id = globalThis.itemDetails[Status].id;
      if (!parsed.options) {
        parsed.options = [];
      } else {
        parsed.options = parsed.options.split(',');
      }
      setProduct(parsed);
    };
    const willFocusSubscription = navigation.addListener('focus', () => {
      fetchProducts();
    });
    fetchProducts();
    return willFocusSubscription;
  }, [navigation]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      globalThis.category = Status;
    });
    return unsubscribe;
  }, [navigation, Status]);

  const route = useRoute();

  if (!product) {
    return (
      <ScrollView style={styles.root}>
        <Text style={styles.title}>Loading</Text>
      </ScrollView>
    );
  }
  return (
    <ScrollView style={styles.root}>
      <Text style={styles.title}>{product.title}</Text>

      {/* Image corousel */}
      <ImageCarousel images={product.images} />

      {/* Option selector */}
      {product.options.length > 0 ? (
        <Picker
          selectedValue={selectedOption}
          onValueChange={itemValue => setSelectedOption(itemValue)}>
          {product.options.map(option => (
            <Picker.Item label={option} value={option} />
          ))}
        </Picker>
      ) : null}

      {/* Price */}
      <Text style={styles.price}>
        {product.price}
        {product.oldPrice && (
          <Text style={styles.oldPrice}> {product.oldPrice}</Text>
        )}
      </Text>

      {/* Decription */}
      <Text style={styles.description}>{product.description}</Text>

      {/* Quantity selctor */}
      <QuantitySelector quantity={quantity} setQuantity={setQuantity} />

      {/* Buttom */}
      <Button
        text={'Add To Cart'}
        onPress={() => {
          if (!globalThis.cart[product.id]) {
            globalThis.cart[product.id] = {};
            globalThis.cart[product.id].id = product.id;
            globalThis.cart[product.id].quantity = quantity;
            globalThis.cart[product.id].item = product;
          } else {
            globalThis.cart[product.id].quantity += quantity;
          }
          setText('added to cart');
          console.log(globalThis.cart);
        }}
        containerStyle={{
          backgroundColor: '#e3c905',
        }}
      />
      <Button
        text={'Buy Now'}
        onPress={() => {
          if (!globalThis.cart[product.id]) {
            globalThis.cart[product.id] = {};
            globalThis.cart[product.id].id = product.id;
            globalThis.cart[product.id].quantity = quantity;
            globalThis.cart[product.id].item = product;
          } else {
            globalThis.cart[product.id].quantity += quantity;
          }
          navigation.navigate('ShoppingCart');
          console.log(globalThis.cart);
        }}
      />
      <Text>{text}</Text>
    </ScrollView>
  );
};

export default ProductScreen;
