const EErrors = {
    PRODUCTS: {
        PRODUCT_NOT_FOUND: '1-1',
        PRODUCT_EXIST: '1-2',
    },

    CARTS: {
        CART_NOT_FOUND: '2-1',
        CART_EXIST: '2-2',
        PRODUCT_NOT_IN_CART: '2-3'
    },

    USERS: {
        USER_ID_NOT_FOUND: '3-1',
        USER_EMAIL_NOT_FOUND: '3-2',
        INVALID_PASSWORD: '3-3'
    },

    MESSAGES: {
        USER_NOT_FOUND: '4-1'
    },

    TICKETS: {
        TICKET_EXIST: '5-1',
    },

    GENERICS: {
        ID_TYPE_NOT_VALID: '6-1',
        ID_CANT_CHANGE: '6-2',
        MISSING_REQUIRED_DATA: '6-3',
    }
}

export default EErrors;