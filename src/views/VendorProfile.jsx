import React, { useState, useRef } from 'react'
import { validateFunc } from '../constraints/constraints'
import { withTranslation } from 'react-i18next'
import Header from '../components/Headers/Header'
import { useQuery, useMutation, gql } from '@apollo/client'
import { getRestaurantProfile, editRestaurant } from '../apollo'
import ConfigurableValues from '../config/constants'
import useStyles from '../components/Restaurant/styles'
import useGlobalStyles from '../utils/globalStyles'
import { Box, Alert, Typography, Button, Input, Grid } from '@mui/material'
import { Container } from '@mui/system'
import CustomLoader from '../components/Loader/CustomLoader'

const GET_PROFILE = gql`
  ${getRestaurantProfile}
`
const EDIT_RESTAURANT = gql`
  ${editRestaurant}
`

const VendorProfile = () => {
 const { CLOUDINARY_UPLOAD_URL, CLOUDINARY_FOOD } = ConfigurableValues()
  const restaurantId = localStorage.getItem('restaurantId')

  const [imgUrl, setImgUrl] = useState('')
  const [nameError, setNameError] = useState(null)
  const [usernameError, setUsernameError] = useState(null)
  const [passwordError, setPasswordError] = useState(null)
  const [addressError, setAddressError] = useState(null)
  const [prefixError, setPrefixError] = useState(null)
  const [deliveryTimeError, setDeliveryTimeError] = useState(null)
  const [minimumOrderError, setMinimumOrderError] = useState(null)
  const [salesTaxError, setSalesTaxError] = useState(null)
  const [errors, setErrors] = useState('')
  const [success, setSuccess] = useState('')
  const onCompleted = data => {
    setNameError(null)
    setAddressError(null)
    setPrefixError(null)
    setUsernameError(null)
    setPasswordError(null)
    setDeliveryTimeError(null)
    setMinimumOrderError(null)
    setSalesTaxError(null)
    setErrors('')
    setSuccess('Restaurant updated successfully')
    setTimeout(hideAlert, 5000)
  }

  const onError = ({ graphQLErrors, networkError }) => {
    setNameError(null)
    setAddressError(null)
    setPrefixError(null)
    setUsernameError(null)
    setPasswordError(null)
    setDeliveryTimeError(null)
    setMinimumOrderError(null)
    setSalesTaxError(null)
    setSuccess('')
    if (graphQLErrors) {
      setErrors(graphQLErrors[0].message)
    }
    if (networkError) {
      setErrors(networkError.result.errors[0].message)
    }
    setTimeout(hideAlert, 5000)
  }
  const hideAlert = () => {
    setErrors('')
    setSuccess('')
  }
  const { data, error: errorQuery, loading: loadingQuery } = useQuery(
    GET_PROFILE,
    {
      variables: { id: restaurantId }
    }
  )
  console.log('Rest data: ', data)
  const [mutate, { loading }] = useMutation(EDIT_RESTAURANT, {
    onError,
    onCompleted
  })

  const formRef = useRef(null)

  const selectImage = (event, state) => {
    const result = filterImage(event)
    if (result) imageToBase64(result)
  }

  const filterImage = event => {
    let images = []
    for (var i = 0; i < event.target.files.length; i++) {
      images[i] = event.target.files.item(i)
    }
    images = images.filter(image => image.name.match(/\.(jpg|jpeg|png|gif)$/))
    return images.length ? images[0] : undefined
  }
  const imageToBase64 = imgUrl => {
    const fileReader = new FileReader()
    fileReader.onloadend = () => {
      setImgUrl(fileReader.result)
    }
    fileReader.readAsDataURL(imgUrl)
  }
  const uploadImageToCloudinary = async () => {
    if (imgUrl === '') return imgUrl

    const apiUrl = CLOUDINARY_UPLOAD_URL
    const data = {
      file: imgUrl,
      upload_preset: CLOUDINARY_FOOD
    }
    try {
      const result = await fetch(apiUrl, {
        body: JSON.stringify(data),
        headers: {
          'content-type': 'application/json'
        },
        method: 'POST'
      })
      const imageData = await result.json()
      return imageData.secure_url
    } catch (e) {
      console.log(e)
    }
  }

  const onSubmitValidaiton = data => {
    const form = formRef.current
    const name = form.name.value
    const address = form.address.value
    const username = form.username.value
    const password = form.password.value
    // IMPORTANT!!!!
    const prefix = form.prefix.value
    const deliveryTime = form.deliveryTime.value
    const minimumOrder = form.minimumOrder.value
    const salesTax = +form.salesTax.value

    const nameErrors = !validateFunc({ name }, 'name')
    const addressErrors = !validateFunc({ address }, 'address')
    const prefixErrors = !validateFunc({ prefix: prefix }, 'prefix')
    const deliveryTimeErrors = !validateFunc(
      { deliveryTime: deliveryTime },
      'deliveryTime'
    )
    const minimumOrderErrors = !validateFunc(
      { minimumOrder: minimumOrder },
      'minimumOrder'
    )
    const usernameErrors = !validateFunc({ name: username }, 'name')
    const passwordErrors = !validateFunc({ password }, 'password')
    const salesTaxError = !validateFunc({ salesTax }, 'salesTax')
    setNameError(nameErrors)
    setAddressError(addressErrors)
    setPrefixError(prefixErrors)
    setUsernameError(usernameErrors)
    setPasswordError(passwordErrors)
    setDeliveryTimeError(deliveryTimeErrors)
    setMinimumOrderError(minimumOrderErrors)
    setSalesTaxError(salesTaxError)
    if (
      !(
        nameErrors &&
        addressErrors &&
        prefixErrors &&
        usernameErrors &&
        passwordErrors &&
        deliveryTimeErrors &&
        minimumOrderErrors &&
        salesTaxError
      )
    ) {
      setErrors('Fields Required')
    }
    return (
      nameErrors &&
      addressErrors &&
      prefixErrors &&
      usernameErrors &&
      passwordErrors &&
      deliveryTimeErrors &&
      minimumOrderErrors &&
      salesTaxError
    )
  }

  const classes = useStyles()
  const globalClasses = useGlobalStyles()
  return (
    <>
      <Header />
      <Container className={globalClasses.flex} fluid>
        <Box container className={classes.container}>
          <Box style={{ alignItems: 'start' }} className={classes.flexRow}>
            <Box item className={classes.heading2}>
              <Typography variant="h6" className={classes.textWhite}>
                Update Profile
              </Typography>
            </Box>
          </Box>
          {errorQuery && <span>{errorQuery.message}</span>}
          {loadingQuery ? (
            <CustomLoader />
          ) : (
            <Box className={classes.form}>
              <form ref={formRef}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Box>
                      <Typography className={classes.labelText}>Restaurant's user name</Typography>
                      <Input
                        style={{ marginTop: -1 }}
                        name="username"
                        id="input-type-username"
                        placeholder="Restaurant's username"
                        type="text"
                        defaultValue={(data && data.restaurant.username) || ''}
                        disableUnderline
                        className={[
                          globalClasses.input,
                          usernameError === false
                            ? globalClasses.inputError
                            : usernameError === true
                              ? globalClasses.inputSuccess
                              : ''
                        ]}
                        onChange={(event) => {
                          if (event.target.value.includes(' ')) {
                            const usernameWithoutSpaces = event.target.value.replace(/ /g, '');
                            event.target.value = usernameWithoutSpaces;
                          }
                        }}
                      />

                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Box>
                      <Typography className={classes.labelText}>Password</Typography>
                      <Input
                        style={{ marginTop: -1 }}
                        name="password"
                        id="input-type-password"
                        placeholder="Restaurant's password"
                        type="text"
                        defaultValue={(data && data.restaurant.password) || ''}
                        disableUnderline
                        className={[
                          globalClasses.input,
                          passwordError === false
                            ? globalClasses.inputError
                            : passwordError === true
                              ? globalClasses.inputSuccess
                              : ''
                        ]}
                      />
                    </Box>
                  </Grid>
                </Grid>

                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Box>
                      <Typography className={classes.labelText}>Name</Typography>
                      <Input
                        style={{ marginTop: -1 }}
                        name="name"
                        id="input-type-name"
                        placeholder="Restaurant's name"
                        type="text"
                        defaultValue={(data && data.restaurant.name) || ''}
                        disableUnderline
                        className={[
                          globalClasses.input,
                          nameError === false
                            ? globalClasses.inputError
                            : nameError === true
                              ? globalClasses.inputSuccess
                              : ''
                        ]}
                      />
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Box>
                      <Typography className={classes.labelText}>Address</Typography>
                      <Input
                        style={{ marginTop: -1 }}
                        name="address"
                        id="input-type-address"
                        placeholder="Restaurant's address"
                        type="text"
                        defaultValue={(data && data.restaurant.address) || ''}
                        disableUnderline
                        className={[
                          globalClasses.input,
                          addressError === false
                            ? globalClasses.inputError
                            : addressError === true
                              ? globalClasses.inputSuccess
                              : ''
                        ]}
                      />
                    </Box>
                  </Grid>
                </Grid>

                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Box>
                      <Typography className={classes.labelText}>Delivery Time</Typography>
                      <Input
                        style={{ marginTop: -1 }}
                        name="deliveryTime"
                        id="input-type-delivery-time"
                        placeholder="Delivery Time"
                        type="number"
                        defaultValue={data && data.restaurant.deliveryTime}
                        disableUnderline
                        className={[
                          globalClasses.input,
                          deliveryTimeError === false
                            ? globalClasses.inputError
                            : deliveryTimeError === true
                              ? globalClasses.inputSuccess
                              : ''
                        ]}
                      />
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Box>
                      <Typography className={classes.labelText}>Minimum Order</Typography>
                      <Input
                        style={{ marginTop: -1 }}
                        name="minimumOrder"
                        id="input-type-minimum-order"
                        placeholder="Minimum order"
                        type="number"
                        disableUnderline
                        defaultValue={data && data.restaurant.minimumOrder}
                        className={[
                          globalClasses.input,
                          minimumOrderError === false
                            ? globalClasses.inputError
                            : minimumOrderError === true
                              ? globalClasses.inputSuccess
                              : ''
                        ]}
                      />
                    </Box>
                  </Grid>
                </Grid>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Box>
                      <Typography className={classes.labelText}>Sales tax</Typography>
                      <Input
                        style={{ marginTop: -1 }}
                        name="salesTax"
                        id="input-type-sales-tax"
                        placeholder="Sales tax"
                        type="number"
                        defaultValue={data && data.restaurant.tax}
                        disableUnderline
                        className={[
                          globalClasses.input,
                          salesTaxError === false
                            ? globalClasses.inputError
                            : salesTaxError === true
                              ? globalClasses.inputSuccess
                              : ''
                        ]}
                      />
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Box>
                      <Typography className={classes.labelText}>Order Prefix</Typography>
                      <Input
                        style={{ marginTop: -1 }}
                        name="prefix"
                        id="input-type-order_id_prefix"
                        placeholder="Order Prefix"
                        type="text"
                        defaultValue={data && data.restaurant.orderPrefix}
                        disableUnderline
                        className={[
                          globalClasses.input,
                          prefixError === false
                            ? globalClasses.inputError
                            : prefixError === true
                              ? globalClasses.inputSuccess
                              : ''
                        ]}
                      />
                    </Box>
                  </Grid>
                </Grid>
                <Box
                  mt={3}
                  style={{ alignItems: 'center' }}
                  className={globalClasses.flex}>
                  <img
                    className={classes.image}
                    alt="..."
                    src={
                      imgUrl ||
                      (data && data.restaurant.image) ||
                      'https://enatega.com/wp-content/uploads/2023/09/default-img.jpg'
                    }
                  />
                  <label htmlFor="file-upload" className={classes.fileUpload}>
                    Upload an image
                  </label>
                  <input
                    className={classes.file}
                    id="file-upload"
                    type="file"
                    accept="image/*"
                    onChange={event => {
                      selectImage(event, 'image_url')
                    }}
                  />
                </Box>
                <Box>
                  <Button
                    className={globalClasses.button}
                    disabled={loading}
                    onClick={async e => {
                      e.preventDefault()
                      if (onSubmitValidaiton()) {
                        const imgUpload = await uploadImageToCloudinary()
                        const form = formRef.current
                        const name = form.name.value
                        const address = form.address.value
                        const prefix = form.prefix.value // can we not update this?
                        const deliveryTime = form.deliveryTime.value
                        const minimumOrder = form.minimumOrder.value
                        const username = form.username.value
                        const password = form.password.value
                        const salesTax = form.salesTax.value
                        mutate({
                          variables: {
                            restaurantInput: {
                              _id: restaurantId,
                              name,
                              address,
                              image:
                                imgUpload ||
                                data.restaurant.image ||
                                'https://enatega.com/wp-content/uploads/2023/09/default-img.jpg',
                              orderPrefix: prefix,
                              deliveryTime: Number(deliveryTime),
                              minimumOrder: Number(minimumOrder),
                              username: username,
                              password: password,
                              salesTax: +salesTax
                            }
                          }
                        })
                      }
                    }}>
                    SAVE
                  </Button>
                </Box>
              </form>
              <Box mt={2}>
                {success && (
                  <Alert
                    className={globalClasses.alertSuccess}
                    variant="filled"
                    severity="success">
                    {success}
                  </Alert>
                )}
                {errors && (
                  <Alert
                    className={globalClasses.alertError}
                    variant="filled"
                    severity="error">
                    {errors}
                  </Alert>
                )}
              </Box>
            </Box>
          )}
        </Box>
      </Container>
    </>
  )
}
export default withTranslation()(VendorProfile)
