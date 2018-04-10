# Kitchen Managment
A web app based on MEAN stack to take orders and display in the kitchen display screen dynamically using socket. There is a prediction page for admins and a report page to compare the sales.

## goals
1. To reduce the chaos and organize a specific system for tracking orders in the food
industry
2. Give a report on the predicted and actual target of orders for each day.

## Users
There are three categories of users for the application
* Customer - Customers can visit the home page of the application and place their
orders by putting in the quantity for the dishes and clicking on the cart
* Kitchen Staff - As soon as a customer places an order, it is reflected in the orders
page,which allows the kitchen staff to work on it in real time and also submit and
mark the order as ‘done’ when they finish the order
* Admin - The admin (upper management) can put prediction values for each dishes
for a day and later get a report on the target reached from the reports section

## Functionalities

#### I. Dishes (Home Page)
This page shows a list of food items. An user can set the quantity of each item and
then click on the cart ( on the top right corner of the page ) to place the order.
#### II. Orders
It is a page which dynamically gets updated as soon as a customer places an
order.This page helps the the kitchen staff to keep a track of the coming orderds
and mark it done as soon as the order is finished.
#### III. Report
This page shows a daily report of the production( the quantity of dishes produced)
and prediction( the quantity predicted) value of each dish. There is a download
button provided at the bottom of the page which helps the admin to download the
report for the day in PDF format.
#### IV. Prediction
This page lists all the dishes with input fields to take the prediction value for each
item for the day.

## API
#### */dishes*
- **GET** - An endpoint to get the dish(es) based on the input (dishId) which has to be
sent as a query.If no dishId is provided,then the whole dish list is returned
- **POST** - An endpoint to post a dish item.It takes the dish details as input which
needs to be attached to the body of the request. Sample request -
```Javascript
{
  dishId: String,
  name: String,
  category: {
  type: String,
  enum: ['Veg', 'Nonveg'],
  },
  imgUrl: String,
}
```
#### */orders*
- **GET** - An endpoint to get all the pending orders for a particular day. It doesn’t take
any inputs .The results are for the present day.This endpoint also returns the
predicted and created-till-now value for the each order.
- **POST** - An endpoint to post an order by a customer.It takes an array of objects as
input in the body. Sample request -
```Javascript
  {
    dishId: String,
    quantity:Number
  }

```
- **PATCH** - An endpoint to update an order.It takes an object as input in the body and
the kitchenID as parameters . Sample request -
```Javascript
  {
	  status:Boolean
  }
```
#### */report*
- **GET** - An endpoint to get a report of the present day stats.The report has the
produced and predicted quantity for each dishes for the present day.

#### */prediction*
- **GET** - An endpoint to get a the predicted quantity of each dish for the present day.

- **POST** -An endpoint to post the predicted quantity of a particular dish.It takes the
dishId and quantity as input which is attached to the body of the request. It checkes
if the entity is already present or not.It is present then the quantity is updated or
else a new document is inserted. Sample Request:
```Javascript
  {
    dishId:String,
    quantity:Number
  }
```
### Database
MongodB has been used for the project.There are three collections, which are -

##### Dishes - Schema
``` Javascript
  {
    dishId: String,
    name: String,
	category: {
    type: String,
    enum: ['Veg', 'Nonveg'],
    },
    imgUrl: String,
}
```
###### Indexes - dishId

#### Orders- Schema
```Javascript
{
  kitchenId: String,
  status: {
  	type: Boolean,
  	default: false, // false represents the Order which hasn’t been done
  },
  quantity: Number,
  orderId: String,
  date: {
  	type: Date,
  	default: Date.now,
  },
  dishId: String,
  }
```

###### Indexes - date , KitchenId
#### Predictions - Schema
```Javascript

{
  date: {
  	type: Date,
  	default: Date.now,
  },
  dishId: String,
  quantity: String,
}
```
###### Indexes - date

### Additional Functions
**Socket** - Socket has been used to make the orders page dynamic so that as soon as an
user places an order, or the status of an existing document is changed, the order page is
updated

**UpdateOrder** - A function which is used to update the order page as soon as an event is
detected by the socket


