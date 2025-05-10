'use client';
"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = PurchaseEditModal;
var react_1 = require("react");
var Dialog_1 = require("@mui/material/Dialog");
var DialogTitle_1 = require("@mui/material/DialogTitle");
var DialogContent_1 = require("@mui/material/DialogContent");
var DialogActions_1 = require("@mui/material/DialogActions");
var Button_1 = require("@mui/material/Button");
var TextField_1 = require("@mui/material/TextField");
var Grid_1 = require("@mui/material/Grid");
var Typography_1 = require("@mui/material/Typography");
var Box_1 = require("@mui/material/Box");
var FormControl_1 = require("@mui/material/FormControl");
var InputLabel_1 = require("@mui/material/InputLabel");
var Select_1 = require("@mui/material/Select");
var MenuItem_1 = require("@mui/material/MenuItem");
var Table_1 = require("@mui/material/Table");
var TableBody_1 = require("@mui/material/TableBody");
var TableCell_1 = require("@mui/material/TableCell");
var TableHead_1 = require("@mui/material/TableHead");
var TableRow_1 = require("@mui/material/TableRow");
var IconButton_1 = require("@mui/material/IconButton");
var CircularProgress_1 = require("@mui/material/CircularProgress");
var Plus_1 = require("@phosphor-icons/react/dist/ssr/Plus");
var Trash_1 = require("@phosphor-icons/react/dist/ssr/Trash");
var transactions_1 = require("@/services/api/transactions");
var inventory_1 = require("@/services/api/inventory");
var companies_1 = require("@/services/api/companies");
var use_auth_1 = require("@/hooks/use-auth");
function PurchaseEditModal(_a) {
    var _this = this;
    var open = _a.open, onClose = _a.onClose, onSave = _a.onSave, _b = _a.purchase, purchase = _b === void 0 ? {
        date: new Date().toISOString().split('T')[0],
        supplier: '',
        status: 'Ordered',
        products: [],
        totalAmount: 0,
        paidAmount: 0,
        dueAmount: 0,
        paymentStatus: 'Unpaid',
        company_id: '',
        store_id: '',
        currency_id: '',
        payment_mode_id: ''
    } : _b, _c = _a.isNew, isNew = _c === void 0 ? true : _c;
    var _d = react_1.default.useState({
        date: new Date().toISOString().split('T')[0],
        supplier: '',
        status: 'Ordered',
        products: [],
        totalAmount: 0,
        paidAmount: 0,
        dueAmount: 0,
        paymentStatus: 'Unpaid',
        company_id: '',
        store_id: '',
        currency_id: '',
        payment_mode_id: ''
    }), formData = _d[0], setFormData = _d[1];
    var _e = react_1.default.useState({}), errors = _e[0], setErrors = _e[1];
    var _f = react_1.default.useState(''), selectedProduct = _f[0], setSelectedProduct = _f[1];
    var _g = (0, react_1.useState)(false), isLoading = _g[0], setIsLoading = _g[1];
    var _h = (0, react_1.useState)([]), suppliers = _h[0], setSuppliers = _h[1];
    var _j = (0, react_1.useState)([]), companies = _j[0], setCompanies = _j[1];
    var _k = (0, react_1.useState)([]), stores = _k[0], setStores = _k[1];
    var _l = (0, react_1.useState)([]), filteredStores = _l[0], setFilteredStores = _l[1];
    var _m = (0, react_1.useState)([]), currencies = _m[0], setCurrencies = _m[1];
    var _o = (0, react_1.useState)([]), paymentModes = _o[0], setPaymentModes = _o[1];
    var _p = (0, react_1.useState)([]), products = _p[0], setProducts = _p[1];
    // Get current user's company
    var _q = (0, use_auth_1.useCurrentUser)(), userInfo = _q.userInfo, isLoadingUser = _q.isLoading;
    // Fetch data when modal opens
    (0, react_1.useEffect)(function () {
        if (open) {
            var fetchData = function () { return __awaiter(_this, void 0, void 0, function () {
                var _a, suppliersData, productsData, companiesData_1, storesData_1, currenciesData_1, paymentModesData_1, companyStores, error_1;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            setIsLoading(true);
                            _b.label = 1;
                        case 1:
                            _b.trys.push([1, 3, 4, 5]);
                            return [4 /*yield*/, Promise.all([
                                    transactions_1.transactionsApi.getSuppliers(),
                                    inventory_1.inventoryApi.getProducts(),
                                    companies_1.companiesApi.getCompanies(),
                                    inventory_1.inventoryApi.getStores(),
                                    companies_1.companiesApi.getCurrencies(),
                                    transactions_1.transactionsApi.getPaymentModes()
                                ])];
                        case 2:
                            _a = _b.sent(), suppliersData = _a[0], productsData = _a[1], companiesData_1 = _a[2], storesData_1 = _a[3], currenciesData_1 = _a[4], paymentModesData_1 = _a[5];
                            setSuppliers(suppliersData);
                            setProducts(productsData);
                            setCompanies(companiesData_1);
                            setStores(storesData_1);
                            setCurrencies(currenciesData_1);
                            setPaymentModes(paymentModesData_1);
                            // Filter stores by user's company
                            if (userInfo === null || userInfo === void 0 ? void 0 : userInfo.company_id) {
                                companyStores = storesData_1.filter(function (store) {
                                    return store.company && store.company.id === userInfo.company_id;
                                });
                                setFilteredStores(companyStores);
                            }
                            // If formData doesn't have IDs, set defaults
                            setFormData(function (prev) {
                                var updated = __assign({}, prev);
                                // Always use the user's company
                                if (userInfo === null || userInfo === void 0 ? void 0 : userInfo.company_id) {
                                    updated.company_id = userInfo.company_id;
                                }
                                else if (!updated.company_id && companiesData_1.length > 0) {
                                    updated.company_id = companiesData_1[0].id;
                                }
                                // Set default store from filtered stores
                                if (!updated.store_id) {
                                    var availableStores = (userInfo === null || userInfo === void 0 ? void 0 : userInfo.company_id)
                                        ? storesData_1.filter(function (store) { return store.company && store.company.id === userInfo.company_id; })
                                        : storesData_1;
                                    if (availableStores.length > 0) {
                                        updated.store_id = availableStores[0].id;
                                    }
                                }
                                if (!updated.currency_id && currenciesData_1.length > 0) {
                                    updated.currency_id = currenciesData_1[0].id;
                                }
                                if (!updated.payment_mode_id && paymentModesData_1.length > 0) {
                                    updated.payment_mode_id = paymentModesData_1[0].id;
                                }
                                return updated;
                            });
                            return [3 /*break*/, 5];
                        case 3:
                            error_1 = _b.sent();
                            console.error('Error fetching data:', error_1);
                            return [3 /*break*/, 5];
                        case 4:
                            setIsLoading(false);
                            return [7 /*endfinally*/];
                        case 5: return [2 /*return*/];
                    }
                });
            }); };
            fetchData();
        }
    }, [open, userInfo]);
    // Filter stores whenever user company changes
    (0, react_1.useEffect)(function () {
        if ((userInfo === null || userInfo === void 0 ? void 0 : userInfo.company_id) && stores.length > 0) {
            var companyStores = stores.filter(function (store) {
                return store.company && store.company.id === userInfo.company_id;
            });
            setFilteredStores(companyStores);
        }
    }, [userInfo, stores]);
    // Reset form data when modal opens with new purchase data
    react_1.default.useEffect(function () {
        if (open) {
            // Update purchase data with user's company if creating new
            var updatedPurchase = __assign({}, purchase);
            // If creating new, use the current user's company_id
            if (!updatedPurchase.id && (userInfo === null || userInfo === void 0 ? void 0 : userInfo.company_id)) {
                updatedPurchase.company_id = userInfo.company_id;
            }
            setFormData(updatedPurchase);
            setErrors({});
            calculateTotals(updatedPurchase.products);
        }
    }, [purchase, open, userInfo]);
    var calculateTotals = function (productItems) {
        var total = 0;
        productItems.forEach(function (item) {
            var subtotal = (item.quantity * item.unitPrice) - item.discount + item.tax;
            total += subtotal;
        });
        setFormData(function (prev) { return (__assign(__assign({}, prev), { totalAmount: total, dueAmount: total - prev.paidAmount, paymentStatus: prev.paidAmount >= total ? 'Paid' : (prev.paidAmount > 0 ? 'Partially Paid' : 'Unpaid') })); });
    };
    var handleChange = function (e) {
        var _a = e.target, name = _a.name, value = _a.value;
        if (name === 'paidAmount') {
            var paidAmount_1 = parseFloat(value) || 0;
            var paymentStatus_1 = paidAmount_1 >= formData.totalAmount
                ? 'Paid'
                : (paidAmount_1 > 0 ? 'Partially Paid' : 'Unpaid');
            setFormData(function (prev) { return (__assign(__assign({}, prev), { paidAmount: paidAmount_1, dueAmount: prev.totalAmount - paidAmount_1, paymentStatus: paymentStatus_1 })); });
        }
        else {
            setFormData(function (prev) {
                var _a;
                return (__assign(__assign({}, prev), (_a = {}, _a[name] = value, _a)));
            });
        }
        // Clear error when field is edited
        if (errors[name]) {
            setErrors(function (prev) {
                var newErrors = __assign({}, prev);
                delete newErrors[name];
                return newErrors;
            });
        }
    };
    var handleSelectChange = function (e) {
        var _a = e.target, name = _a.name, value = _a.value;
        setFormData(function (prev) {
            var _a;
            return (__assign(__assign({}, prev), (_a = {}, _a[name] = value, _a)));
        });
        // Map the status to is_credit boolean
        if (name === 'status') {
            setFormData(function (prev) { return (__assign(__assign({}, prev), { is_credit: value === 'Credit' || value === 'Pending' })); });
        }
    };
    var handleAddProduct = function () {
        if (!selectedProduct)
            return;
        var product = products.find(function (p) { return p.id === selectedProduct; });
        if (!product)
            return;
        var unitPrice = product.purchase_price ? parseFloat(product.purchase_price) : 0;
        var tax = unitPrice * 0.1; // Default 10% tax if not available from the product
        var newProduct = {
            id: product.id,
            name: product.name,
            quantity: 1,
            unitPrice: unitPrice,
            discount: 0,
            tax: tax,
            subtotal: unitPrice + tax
        };
        var updatedProducts = __spreadArray(__spreadArray([], formData.products, true), [newProduct], false);
        setFormData(function (prev) { return (__assign(__assign({}, prev), { products: updatedProducts })); });
        calculateTotals(updatedProducts);
        setSelectedProduct('');
    };
    var handleRemoveProduct = function (id) {
        var updatedProducts = formData.products.filter(function (product) { return product.id !== id; });
        setFormData(function (prev) { return (__assign(__assign({}, prev), { products: updatedProducts })); });
        calculateTotals(updatedProducts);
    };
    var handleProductChange = function (id, field, value) {
        var updatedProducts = formData.products.map(function (product) {
            var _a;
            if (product.id === id) {
                var updatedProduct = __assign(__assign({}, product), (_a = {}, _a[field] = parseFloat(value) || 0, _a));
                // Recalculate subtotal
                updatedProduct.subtotal = (updatedProduct.quantity * updatedProduct.unitPrice) -
                    updatedProduct.discount + updatedProduct.tax;
                return updatedProduct;
            }
            return product;
        });
        setFormData(function (prev) { return (__assign(__assign({}, prev), { products: updatedProducts })); });
        calculateTotals(updatedProducts);
    };
    var validateForm = function () {
        var newErrors = {};
        if (!formData.supplier) {
            newErrors.supplier = 'Supplier is required';
        }
        if (!formData.date) {
            newErrors.date = 'Date is required';
        }
        if (formData.products.length === 0) {
            newErrors.products = 'At least one product is required';
        }
        if (!formData.company_id) {
            newErrors.company_id = 'Company is required';
        }
        if (!formData.store_id) {
            newErrors.store_id = 'Store is required';
        }
        if (!formData.currency_id) {
            newErrors.currency_id = 'Currency is required';
        }
        if (!formData.payment_mode_id) {
            newErrors.payment_mode_id = 'Payment mode is required';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };
    var handleSubmit = function () {
        if (validateForm()) {
            onSave(formData);
        }
    };
    return (<Dialog_1.default open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle_1.default>{isNew ? 'Create New Purchase' : 'Edit Purchase'}</DialogTitle_1.default>
      <DialogContent_1.default>
        {isLoading ? (<Box_1.default sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
            <CircularProgress_1.default />
          </Box_1.default>) : (<Grid_1.default container spacing={2} sx={{ mt: 1 }}>
            <Grid_1.default item xs={12} md={3}>
              <TextField_1.default name="date" label="Purchase Date" type="date" fullWidth value={formData.date} onChange={handleChange} error={!!errors.date} helperText={errors.date} InputLabelProps={{ shrink: true }}/>
            </Grid_1.default>
            
            <Grid_1.default item xs={12} md={3}>
              <FormControl_1.default fullWidth error={!!errors.supplier}>
                <InputLabel_1.default id="supplier-select-label">Supplier</InputLabel_1.default>
                <Select_1.default labelId="supplier-select-label" id="supplier" name="supplier" value={formData.supplier} label="Supplier" onChange={handleSelectChange}>
                  {suppliers.map(function (supplier) { return (<MenuItem_1.default key={supplier.id} value={supplier.id}>{supplier.name}</MenuItem_1.default>); })}
                </Select_1.default>
                {errors.supplier && <Typography_1.default color="error" variant="caption">{errors.supplier}</Typography_1.default>}
              </FormControl_1.default>
            </Grid_1.default>
            
            <Grid_1.default item xs={12} md={3}>
              <FormControl_1.default fullWidth>
                <InputLabel_1.default id="status-select-label">Status</InputLabel_1.default>
                <Select_1.default labelId="status-select-label" id="status" name="status" value={formData.status} label="Status" onChange={handleSelectChange}>
                  <MenuItem_1.default value="Ordered">Ordered</MenuItem_1.default>
                  <MenuItem_1.default value="Pending">Pending</MenuItem_1.default>
                  <MenuItem_1.default value="Received">Received</MenuItem_1.default>
                  <MenuItem_1.default value="Credit">Credit</MenuItem_1.default>
                  <MenuItem_1.default value="Paid">Paid</MenuItem_1.default>
                </Select_1.default>
              </FormControl_1.default>
            </Grid_1.default>
            
            <Grid_1.default item xs={12} md={3}>
              <TextField_1.default name="reference" label="Reference (Optional)" type="text" fullWidth value={formData.reference || ''} onChange={handleChange}/>
            </Grid_1.default>
            
            <Grid_1.default item xs={12} md={3}>
              <FormControl_1.default fullWidth error={!!errors.company_id} disabled={!!(userInfo === null || userInfo === void 0 ? void 0 : userInfo.company_id)}>
                <InputLabel_1.default id="company-select-label">Company</InputLabel_1.default>
                <Select_1.default labelId="company-select-label" id="company_id" name="company_id" value={formData.company_id} label="Company" onChange={handleSelectChange} disabled={!!(userInfo === null || userInfo === void 0 ? void 0 : userInfo.company_id)} // Disable when we have a user company
        >
                  {companies.map(function (company) { return (<MenuItem_1.default key={company.id} value={company.id} disabled={Boolean((userInfo === null || userInfo === void 0 ? void 0 : userInfo.company_id) && company.id !== userInfo.company_id)}>
                      {company.name}
                    </MenuItem_1.default>); })}
                </Select_1.default>
                {errors.company_id && <Typography_1.default color="error" variant="caption">{errors.company_id}</Typography_1.default>}
              </FormControl_1.default>
            </Grid_1.default>
            
            <Grid_1.default item xs={12} md={3}>
              <FormControl_1.default fullWidth error={!!errors.store_id}>
                <InputLabel_1.default id="store-select-label">Store</InputLabel_1.default>
                <Select_1.default labelId="store-select-label" id="store_id" name="store_id" value={formData.store_id} label="Store" onChange={handleSelectChange}>
                  {filteredStores.length > 0 ? (filteredStores.map(function (store) { return (<MenuItem_1.default key={store.id} value={store.id}>{store.name}</MenuItem_1.default>); })) : (stores.map(function (store) { return (<MenuItem_1.default key={store.id} value={store.id} disabled={Boolean((userInfo === null || userInfo === void 0 ? void 0 : userInfo.company_id) && store.company && store.company.id !== userInfo.company_id)}>
                        {store.name}
                      </MenuItem_1.default>); }))}
                </Select_1.default>
                {errors.store_id && <Typography_1.default color="error" variant="caption">{errors.store_id}</Typography_1.default>}
              </FormControl_1.default>
            </Grid_1.default>
            
            <Grid_1.default item xs={12} md={3}>
              <FormControl_1.default fullWidth error={!!errors.currency_id}>
                <InputLabel_1.default id="currency-select-label">Currency</InputLabel_1.default>
                <Select_1.default labelId="currency-select-label" id="currency_id" name="currency_id" value={formData.currency_id} label="Currency" onChange={handleSelectChange}>
                  {currencies.map(function (currency) { return (<MenuItem_1.default key={currency.id} value={currency.id}>{currency.code}</MenuItem_1.default>); })}
                </Select_1.default>
                {errors.currency_id && <Typography_1.default color="error" variant="caption">{errors.currency_id}</Typography_1.default>}
              </FormControl_1.default>
            </Grid_1.default>
            
            <Grid_1.default item xs={12} md={3}>
              <FormControl_1.default fullWidth error={!!errors.payment_mode_id}>
                <InputLabel_1.default id="payment-mode-select-label">Payment Mode</InputLabel_1.default>
                <Select_1.default labelId="payment-mode-select-label" id="payment_mode_id" name="payment_mode_id" value={formData.payment_mode_id} label="Payment Mode" onChange={handleSelectChange}>
                  {paymentModes.map(function (mode) { return (<MenuItem_1.default key={mode.id} value={mode.id}>{mode.name}</MenuItem_1.default>); })}
                </Select_1.default>
                {errors.payment_mode_id && <Typography_1.default color="error" variant="caption">{errors.payment_mode_id}</Typography_1.default>}
              </FormControl_1.default>
            </Grid_1.default>
            
            <Grid_1.default item xs={12}>
              <Box_1.default sx={{ mb: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography_1.default variant="subtitle1">Products</Typography_1.default>
                <Box_1.default sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                  <FormControl_1.default sx={{ minWidth: 200 }}>
                    <InputLabel_1.default id="product-select-label">Select Product</InputLabel_1.default>
                    <Select_1.default labelId="product-select-label" id="selectedProduct" name="selectedProduct" value={selectedProduct} label="Select Product" onChange={function (e) { return setSelectedProduct(e.target.value); }} size="small">
                      {products.map(function (product) { return (<MenuItem_1.default key={product.id} value={product.id}>{product.name}</MenuItem_1.default>); })}
                    </Select_1.default>
                  </FormControl_1.default>
                  <Button_1.default variant="contained" onClick={handleAddProduct} startIcon={<Plus_1.Plus weight="bold"/>} sx={{ bgcolor: '#0ea5e9', '&:hover': { bgcolor: '#0284c7' } }} size="small">
                    Add
                  </Button_1.default>
                </Box_1.default>
              </Box_1.default>
              
              {errors.products && (<Typography_1.default color="error" variant="caption" sx={{ mb: 1, display: 'block' }}>
                  {errors.products}
                </Typography_1.default>)}
              
              <Table_1.default size="small" sx={{ mb: 3 }}>
                <TableHead_1.default>
                  <TableRow_1.default>
                    <TableCell_1.default>Product</TableCell_1.default>
                    <TableCell_1.default>Quantity</TableCell_1.default>
                    <TableCell_1.default>Unit Price</TableCell_1.default>
                    <TableCell_1.default>Discount</TableCell_1.default>
                    <TableCell_1.default>Tax</TableCell_1.default>
                    <TableCell_1.default>Subtotal</TableCell_1.default>
                    <TableCell_1.default>Action</TableCell_1.default>
                  </TableRow_1.default>
                </TableHead_1.default>
                <TableBody_1.default>
                  {formData.products.length === 0 ? (<TableRow_1.default>
                      <TableCell_1.default colSpan={7} align="center">
                        <Typography_1.default variant="body2" color="text.secondary">
                          No products added yet
                        </Typography_1.default>
                      </TableCell_1.default>
                    </TableRow_1.default>) : (formData.products.map(function (product) { return (<TableRow_1.default key={product.id}>
                        <TableCell_1.default>{product.name}</TableCell_1.default>
                        <TableCell_1.default>
                          <TextField_1.default type="number" value={product.quantity} onChange={function (e) { return handleProductChange(product.id, 'quantity', e.target.value); }} inputProps={{ min: 1 }} size="small" sx={{ width: 70 }}/>
                        </TableCell_1.default>
                        <TableCell_1.default>
                          <TextField_1.default type="number" value={product.unitPrice} onChange={function (e) { return handleProductChange(product.id, 'unitPrice', e.target.value); }} InputProps={{ startAdornment: '$' }} size="small" sx={{ width: 100 }}/>
                        </TableCell_1.default>
                        <TableCell_1.default>
                          <TextField_1.default type="number" value={product.discount} onChange={function (e) { return handleProductChange(product.id, 'discount', e.target.value); }} InputProps={{ startAdornment: '$' }} size="small" sx={{ width: 80 }}/>
                        </TableCell_1.default>
                        <TableCell_1.default>
                          <TextField_1.default type="number" value={product.tax} onChange={function (e) { return handleProductChange(product.id, 'tax', e.target.value); }} InputProps={{ startAdornment: '$' }} size="small" sx={{ width: 80 }}/>
                        </TableCell_1.default>
                        <TableCell_1.default>${product.subtotal.toFixed(2)}</TableCell_1.default>
                        <TableCell_1.default>
                          <IconButton_1.default size="small" onClick={function () { return handleRemoveProduct(product.id); }} sx={{ color: '#ef4444' }}>
                            <Trash_1.Trash size={16}/>
                          </IconButton_1.default>
                        </TableCell_1.default>
                      </TableRow_1.default>); }))}
                </TableBody_1.default>
              </Table_1.default>
            </Grid_1.default>
            
            <Grid_1.default item xs={12}>
              <TextField_1.default name="note" label="Note (Optional)" multiline rows={2} fullWidth value={formData.note || ''} onChange={handleChange}/>
            </Grid_1.default>
            
            <Grid_1.default item xs={12}>
              <Box_1.default sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-end',
                gap: 1,
                mt: 2
            }}>
                <Box_1.default sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography_1.default variant="subtitle1" sx={{ minWidth: 150 }}>Total Amount:</Typography_1.default>
                  <Typography_1.default variant="subtitle1">${formData.totalAmount.toFixed(2)}</Typography_1.default>
                </Box_1.default>
                <Box_1.default sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography_1.default variant="subtitle1" sx={{ minWidth: 150 }}>Paid Amount:</Typography_1.default>
                  <TextField_1.default name="paidAmount" type="number" value={formData.paidAmount} onChange={handleChange} InputProps={{ startAdornment: '$' }} size="small" sx={{ width: 120 }}/>
                </Box_1.default>
                <Box_1.default sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography_1.default variant="subtitle1" sx={{ minWidth: 150 }}>Due Amount:</Typography_1.default>
                  <Typography_1.default variant="subtitle1" color={formData.dueAmount > 0 ? 'error' : 'success'}>
                    ${formData.dueAmount.toFixed(2)}
                  </Typography_1.default>
                </Box_1.default>
                <Box_1.default sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography_1.default variant="subtitle1" sx={{ minWidth: 150 }}>Payment Status:</Typography_1.default>
                  <Typography_1.default variant="subtitle1" color={formData.paymentStatus === 'Paid'
                ? 'success'
                : formData.paymentStatus === 'Partially Paid'
                    ? 'warning'
                    : 'error'}>
                    {formData.paymentStatus}
                  </Typography_1.default>
                </Box_1.default>
              </Box_1.default>
            </Grid_1.default>
          </Grid_1.default>)}
      </DialogContent_1.default>
      <DialogActions_1.default>
        <Button_1.default onClick={onClose} variant="outlined">Cancel</Button_1.default>
        <Button_1.default onClick={handleSubmit} variant="contained" disabled={isLoading}>Save</Button_1.default>
      </DialogActions_1.default>
    </Dialog_1.default>);
}
