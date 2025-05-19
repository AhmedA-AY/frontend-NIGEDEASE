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
exports.default = PurchasesPage;
var React = require("react");
var Box_1 = require("@mui/material/Box");
var Button_1 = require("@mui/material/Button");
var Card_1 = require("@mui/material/Card");
var Checkbox_1 = require("@mui/material/Checkbox");
var Typography_1 = require("@mui/material/Typography");
var Table_1 = require("@mui/material/Table");
var TableBody_1 = require("@mui/material/TableBody");
var TableCell_1 = require("@mui/material/TableCell");
var TableHead_1 = require("@mui/material/TableHead");
var TableRow_1 = require("@mui/material/TableRow");
var TextField_1 = require("@mui/material/TextField");
var Tabs_1 = require("@mui/material/Tabs");
var Tab_1 = require("@mui/material/Tab");
var IconButton_1 = require("@mui/material/IconButton");
var Chip_1 = require("@mui/material/Chip");
var Menu_1 = require("@mui/material/Menu");
var MenuItem_1 = require("@mui/material/MenuItem");
var Select_1 = require("@mui/material/Select");
var InputAdornment_1 = require("@mui/material/InputAdornment");
var OutlinedInput_1 = require("@mui/material/OutlinedInput");
var Plus_1 = require("@phosphor-icons/react/dist/ssr/Plus");
var MagnifyingGlass_1 = require("@phosphor-icons/react/dist/ssr/MagnifyingGlass");
var DotsThree_1 = require("@phosphor-icons/react/dist/ssr/DotsThree");
var paths_1 = require("@/paths");
var PurchaseEditModal_1 = require("@/components/admin/purchases/PurchaseEditModal");
var DeleteConfirmationModal_1 = require("@/components/admin/product-manager/DeleteConfirmationModal");
var react_1 = require("react");
var transactions_1 = require("@/services/api/transactions");
var inventory_1 = require("@/services/api/inventory");
var companies_1 = require("@/services/api/companies");
var CircularProgress_1 = require("@mui/material/CircularProgress");
var Grid_1 = require("@mui/material/Grid");
var use_auth_1 = require("@/hooks/use-auth");
function PurchasesPage() {
    var _this = this;
    var _a = React.useState(0), tabValue = _a[0], setTabValue = _a[1];
    var _b = React.useState([]), selectedPurchases = _b[0], setSelectedPurchases = _b[1];
    var _c = React.useState({}), anchorElMap = _c[0], setAnchorElMap = _c[1];
    var _d = React.useState(false), isPurchaseModalOpen = _d[0], setIsPurchaseModalOpen = _d[1];
    var _e = React.useState(false), isDeleteModalOpen = _e[0], setIsDeleteModalOpen = _e[1];
    var _f = React.useState(null), currentPurchase = _f[0], setCurrentPurchase = _f[1];
    var _g = React.useState(null), purchaseToDelete = _g[0], setPurchaseToDelete = _g[1];
    var _h = (0, react_1.useState)(true), isLoading = _h[0], setIsLoading = _h[1];
    var _j = (0, react_1.useState)([]), purchases = _j[0], setPurchases = _j[1];
    var _k = (0, react_1.useState)([]), suppliers = _k[0], setSuppliers = _k[1];
    var _l = (0, react_1.useState)([]), companies = _l[0], setCompanies = _l[1];
    var _m = (0, react_1.useState)([]), stores = _m[0], setStores = _m[1];
    var _o = (0, react_1.useState)([]), filteredStores = _o[0], setFilteredStores = _o[1];
    var _p = (0, react_1.useState)([]), currencies = _p[0], setCurrencies = _p[1];
    var _q = (0, react_1.useState)([]), paymentModes = _q[0], setPaymentModes = _q[1];
    var _r = (0, react_1.useState)(''), selectedSupplier = _r[0], setSelectedSupplier = _r[1];
    var _s = (0, react_1.useState)(null), selectedPurchaseDetails = _s[0], setSelectedPurchaseDetails = _s[1];
    // Get current user's company
    var _t = (0, use_auth_1.useCurrentUser)(), userInfo = _t.userInfo, isLoadingUser = _t.isLoading;
    // Fetch purchases and suppliers
    var fetchData = (0, react_1.useCallback)(function () { return __awaiter(_this, void 0, void 0, function () {
        var _a, purchasesData, suppliersData, companiesData, storesData, currenciesData, paymentModesData, storesForCompany, error_1;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    setIsLoading(true);
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 3, 4, 5]);
                    return [4 /*yield*/, Promise.all([
                            transactions_1.transactionsApi.getPurchases(),
                            transactions_1.transactionsApi.getSuppliers(),
                            companies_1.companiesApi.getCompanies(),
                            inventory_1.inventoryApi.getStores(),
                            companies_1.companiesApi.getCurrencies(),
                            transactions_1.transactionsApi.getPaymentModes()
                        ])];
                case 2:
                    _a = _b.sent(), purchasesData = _a[0], suppliersData = _a[1], companiesData = _a[2], storesData = _a[3], currenciesData = _a[4], paymentModesData = _a[5];
                    setPurchases(purchasesData);
                    setSuppliers(suppliersData);
                    setCompanies(companiesData);
                    setStores(storesData);
                    setCurrencies(currenciesData);
                    setPaymentModes(paymentModesData);
                    // Filter stores based on user's company
                    if (userInfo === null || userInfo === void 0 ? void 0 : userInfo.company_id) {
                        storesForCompany = storesData.filter(function (store) {
                            return store.company && store.company.id === userInfo.company_id;
                        });
                        setFilteredStores(storesForCompany);
                    }
                    console.log('Fetched data:', {
                        companies: companiesData,
                        stores: storesData,
                        currencies: currenciesData,
                        paymentModes: paymentModesData
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
    }); }, [userInfo]);
    (0, react_1.useEffect)(function () {
        if (!isLoadingUser) {
            fetchData();
        }
    }, [fetchData, isLoadingUser]);
    // Filter stores when userInfo changes
    (0, react_1.useEffect)(function () {
        if ((userInfo === null || userInfo === void 0 ? void 0 : userInfo.company_id) && stores.length > 0) {
            var storesForCompany = stores.filter(function (store) {
                return store.company && store.company.id === userInfo.company_id;
            });
            setFilteredStores(storesForCompany);
        }
    }, [userInfo, stores]);
    // Filter purchases by selected supplier
    var filteredPurchases = selectedSupplier
        ? purchases.filter(function (purchase) { return purchase.supplier.id === selectedSupplier; })
        : purchases;
    // Further filter purchases by user's company if available
    var companyPurchases = (userInfo === null || userInfo === void 0 ? void 0 : userInfo.company_id)
        ? filteredPurchases.filter(function (purchase) { return purchase.company.id === userInfo.company_id; })
        : filteredPurchases;
    // Calculate total amounts
    var totalAmount = companyPurchases.reduce(function (sum, purchase) { return sum + parseFloat(purchase.total_amount); }, 0);
    var totalPaid = 0; // Not available in the API directly
    var totalDue = totalAmount - totalPaid;
    var handleTabChange = function (event, newValue) {
        setTabValue(newValue);
        setSelectedPurchaseDetails(null); // Reset selected purchase details when changing tabs
    };
    var handleSelectAll = function (event) {
        if (event.target.checked) {
            setSelectedPurchases(companyPurchases.map(function (purchase) { return purchase.id; }));
        }
        else {
            setSelectedPurchases([]);
        }
    };
    var handleSelectOne = function (id) {
        if (selectedPurchases.includes(id)) {
            setSelectedPurchases(selectedPurchases.filter(function (purchaseId) { return purchaseId !== id; }));
        }
        else {
            setSelectedPurchases(__spreadArray(__spreadArray([], selectedPurchases, true), [id], false));
        }
    };
    var handleSupplierChange = function (event) {
        setSelectedSupplier(event.target.value);
    };
    var handleMenuOpen = function (event, id) {
        var _a;
        setAnchorElMap(__assign(__assign({}, anchorElMap), (_a = {}, _a[id] = event.currentTarget, _a)));
    };
    var handleMenuClose = function (id) {
        var _a;
        setAnchorElMap(__assign(__assign({}, anchorElMap), (_a = {}, _a[id] = null, _a)));
    };
    var handleRowClick = function (purchase) {
        setSelectedPurchaseDetails(purchase);
        setTabValue(3); // Switch to a new tab for viewing purchase details
    };
    var handleAddNewPurchase = function () {
        // Use the current user's company ID instead of the first company
        var userCompanyId = (userInfo === null || userInfo === void 0 ? void 0 : userInfo.company_id) || '';
        // Only get stores from user's company
        var defaultStoreId = filteredStores.length > 0 ? filteredStores[0].id : '';
        var defaultCurrencyId = currencies.length > 0 ? currencies[0].id : '';
        var defaultPaymentModeId = paymentModes.length > 0 ? paymentModes[0].id : '';
        setCurrentPurchase({
            date: new Date().toISOString().split('T')[0],
            supplier: '',
            status: 'Ordered',
            products: [],
            totalAmount: 0,
            paidAmount: 0,
            dueAmount: 0,
            paymentStatus: 'Unpaid',
            company_id: userCompanyId,
            store_id: defaultStoreId,
            currency_id: defaultCurrencyId,
            payment_mode_id: defaultPaymentModeId,
            is_credit: false
        });
        setIsPurchaseModalOpen(true);
    };
    var handleEditPurchase = function (id) { return __awaiter(_this, void 0, void 0, function () {
        var purchaseToEdit, purchaseItems, products, error_2;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    purchaseToEdit = purchases.find(function (purchase) { return purchase.id === id; });
                    if (!purchaseToEdit) return [3 /*break*/, 6];
                    // Show loading indicator
                    setIsLoading(true);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 4, 5, 6]);
                    return [4 /*yield*/, transactions_1.transactionsApi.getPurchaseItems(id)];
                case 2:
                    purchaseItems = _a.sent();
                    return [4 /*yield*/, Promise.all(purchaseItems.map(function (item) { return __awaiter(_this, void 0, void 0, function () {
                            var product, err_1;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        _a.trys.push([0, 2, , 3]);
                                        return [4 /*yield*/, inventory_1.inventoryApi.getProduct(selectedStore.id, item.product.id)];
                                    case 1:
                                        product = _a.sent();
                                        return [3 /*break*/, 3];
                                    case 2:
                                        err_1 = _a.sent();
                                        console.error("Error fetching product ".concat(item.product.id, ":"), err_1);
                                        product = item.product;
                                        return [3 /*break*/, 3];
                                    case 3: return [2 /*return*/, {
                                            id: item.product.id,
                                            name: product.name,
                                            quantity: parseInt(item.quantity),
                                            unitPrice: product.purchase_price ? parseFloat(product.purchase_price) : 0,
                                            discount: 0, // Not available from API, default to 0
                                            tax: 0, // Not available from API, default to 0
                                            subtotal: parseFloat(item.quantity) * (product.purchase_price ? parseFloat(product.purchase_price) : 0)
                                        }];
                                }
                            });
                        }); }))];
                case 3:
                    products = _a.sent();
                    // Convert the purchase data to the format expected by the modal
                    setCurrentPurchase({
                        id: purchaseToEdit.id,
                        date: new Date(purchaseToEdit.created_at).toISOString().split('T')[0],
                        supplier: purchaseToEdit.supplier.id,
                        status: purchaseToEdit.is_credit ? 'Credit' : 'Paid',
                        products: products,
                        totalAmount: parseFloat(purchaseToEdit.total_amount),
                        paidAmount: 0, // Not available directly
                        dueAmount: parseFloat(purchaseToEdit.total_amount), // Assuming full amount is due
                        paymentStatus: purchaseToEdit.is_credit ? 'Unpaid' : 'Paid',
                        company_id: purchaseToEdit.company.id,
                        store_id: purchaseToEdit.store.id,
                        currency_id: purchaseToEdit.currency.id,
                        payment_mode_id: purchaseToEdit.payment_mode.id,
                        is_credit: purchaseToEdit.is_credit
                    });
                    setIsPurchaseModalOpen(true);
                    handleMenuClose(id);
                    return [3 /*break*/, 6];
                case 4:
                    error_2 = _a.sent();
                    console.error('Error fetching purchase items:', error_2);
                    alert('Failed to fetch purchase details. Please try again.');
                    return [3 /*break*/, 6];
                case 5:
                    setIsLoading(false);
                    return [7 /*endfinally*/];
                case 6: return [2 /*return*/];
            }
        });
    }); };
    var handleDeletePurchase = function (id) {
        setPurchaseToDelete(id);
        setIsDeleteModalOpen(true);
        handleMenuClose(id);
    };
    var handleConfirmDelete = function () { return __awaiter(_this, void 0, void 0, function () {
        var error_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!purchaseToDelete) return [3 /*break*/, 4];
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, transactions_1.transactionsApi.deletePurchase(purchaseToDelete)];
                case 2:
                    _a.sent();
                    console.log("Deleted purchase with ID: ".concat(purchaseToDelete));
                    // Refresh data
                    fetchData();
                    setIsDeleteModalOpen(false);
                    setPurchaseToDelete(null);
                    return [3 /*break*/, 4];
                case 3:
                    error_3 = _a.sent();
                    console.error('Error deleting purchase:', error_3);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    var handleSavePurchase = function (purchaseData) { return __awaiter(_this, void 0, void 0, function () {
        var company_id, store_id, currency_id, payment_mode_id, items, purchasePayload, error_4;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 5, , 6]);
                    // Log data before creating/updating
                    console.log('Purchase data to save:', purchaseData);
                    company_id = (userInfo === null || userInfo === void 0 ? void 0 : userInfo.company_id) || '';
                    store_id = purchaseData.store_id || (filteredStores.length > 0 ? filteredStores[0].id : '');
                    currency_id = purchaseData.currency_id || (currencies.length > 0 ? currencies[0].id : '');
                    payment_mode_id = purchaseData.payment_mode_id || (paymentModes.length > 0 ? paymentModes[0].id : '');
                    // Log IDs being used
                    console.log('Using IDs:', {
                        company_id: company_id,
                        store_id: store_id,
                        currency_id: currency_id,
                        payment_mode_id: payment_mode_id
                    });
                    items = (purchaseData.products || []).map(function (product) { return ({
                        product_id: product.id,
                        quantity: String(product.quantity) // Ensure quantity is a string
                    }); });
                    // Make sure we have at least one item
                    if (items.length === 0) {
                        alert("You must add at least one product to create a purchase.");
                        return [2 /*return*/];
                    }
                    purchasePayload = {
                        company_id: company_id,
                        store_id: store_id,
                        supplier_id: purchaseData.supplier,
                        total_amount: purchaseData.totalAmount.toString(),
                        currency_id: currency_id,
                        payment_mode_id: payment_mode_id,
                        is_credit: purchaseData.status === 'Credit',
                        items: items
                    };
                    // Show final payload
                    console.log('Final purchase payload:', purchasePayload);
                    if (!purchaseData.id) return [3 /*break*/, 2];
                    // Update existing purchase
                    return [4 /*yield*/, transactions_1.transactionsApi.updatePurchase(purchaseData.id, purchasePayload)];
                case 1:
                    // Update existing purchase
                    _a.sent();
                    console.log("Updated purchase: ".concat(JSON.stringify(purchasePayload)));
                    return [3 /*break*/, 4];
                case 2: 
                // Add new purchase
                return [4 /*yield*/, transactions_1.transactionsApi.createPurchase(purchasePayload)];
                case 3:
                    // Add new purchase
                    _a.sent();
                    console.log("Added new purchase: ".concat(JSON.stringify(purchasePayload)));
                    _a.label = 4;
                case 4:
                    // Refresh the data
                    fetchData();
                    setIsPurchaseModalOpen(false);
                    return [3 /*break*/, 6];
                case 5:
                    error_4 = _a.sent();
                    console.error('Error saving purchase:', error_4);
                    // Display the error details if available
                    if (error_4.response && error_4.response.data) {
                        console.error('API error details:', error_4.response.data);
                        alert("Error: ".concat(JSON.stringify(error_4.response.data)));
                    }
                    else {
                        alert("An error occurred while saving the purchase.");
                    }
                    return [3 /*break*/, 6];
                case 6: return [2 /*return*/];
            }
        });
    }); };
    // Generate breadcrumb path links
    var breadcrumbItems = [
        { label: 'Dashboard', url: paths_1.paths.admin.dashboard },
        { label: 'Purchases', url: paths_1.paths.admin.purchases },
    ];
    return (<Box_1.default component="main" sx={{ flexGrow: 1, py: 3 }}>
      {/* Header and Breadcrumbs */}
      <Box_1.default sx={{ mb: 3 }}>
        <Typography_1.default variant="h4" sx={{ mb: 1 }}>Purchases</Typography_1.default>
        <Box_1.default sx={{ display: 'flex', alignItems: 'center', color: 'text.secondary' }}>
          {breadcrumbItems.map(function (item, index) { return (<React.Fragment key={index}>
              {index > 0 && <Box_1.default component="span" sx={{ mx: 0.5 }}>-</Box_1.default>}
              <Typography_1.default component="a" href={item.url} variant="body2" color={index === breadcrumbItems.length - 1 ? 'text.primary' : 'inherit'} sx={{ textDecoration: 'none' }}>
                {item.label}
              </Typography_1.default>
            </React.Fragment>); })}
        </Box_1.default>
      </Box_1.default>

      {/* Action Buttons and Filters */}
      <Box_1.default sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Box_1.default>
          <Button_1.default variant="contained" startIcon={<Plus_1.Plus weight="bold"/>} sx={{ bgcolor: '#0ea5e9', '&:hover': { bgcolor: '#0284c7' } }} onClick={handleAddNewPurchase}>
            Add New Purchase
          </Button_1.default>
        </Box_1.default>
        <Box_1.default sx={{ display: 'flex', gap: 1 }}>
          <TextField_1.default placeholder="Search By Invoice..." size="small" InputProps={{
            startAdornment: (<InputAdornment_1.default position="start">
                  <MagnifyingGlass_1.MagnifyingGlass size={20}/>
                </InputAdornment_1.default>),
        }} sx={{ width: 200 }}/>
          <Select_1.default displayEmpty value={selectedSupplier} onChange={handleSupplierChange} input={<OutlinedInput_1.default size="small"/>} renderValue={function (selected) {
            if (!selected) {
                return <Typography_1.default color="text.secondary">Select Supplier...</Typography_1.default>;
            }
            var supplier = suppliers.find(function (s) { return s.id === selected; });
            return supplier ? supplier.name : "";
        }} sx={{ minWidth: 200 }}>
            <MenuItem_1.default value="">All Suppliers</MenuItem_1.default>
            {suppliers.map(function (supplier) { return (<MenuItem_1.default key={supplier.id} value={supplier.id}>{supplier.name}</MenuItem_1.default>); })}
          </Select_1.default>
          <Box_1.default sx={{
            display: 'flex',
            border: '1px solid #e0e0e0',
            borderRadius: 1,
            overflow: 'hidden',
            alignItems: 'center',
        }}>
            <input type="text" placeholder="Start Date" style={{
            border: 'none',
            padding: '8px 12px',
            outline: 'none',
            width: 80
        }}/>
            <Box_1.default sx={{ display: 'flex', alignItems: 'center', px: 1 }}>→</Box_1.default>
            <input type="text" placeholder="End Date" style={{
            border: 'none',
            padding: '8px 12px',
            outline: 'none',
            width: 80
        }}/>
          </Box_1.default>
        </Box_1.default>
      </Box_1.default>

      {/* Purchase Type Tabs */}
      <Box_1.default sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
        <Tabs_1.default value={tabValue} onChange={handleTabChange} aria-label="purchase type tabs">
          <Tab_1.default label="All Purchases" sx={{
            textTransform: 'none',
            minHeight: 48,
            color: tabValue === 0 ? '#0ea5e9' : 'text.primary',
            '&.Mui-selected': { color: '#0ea5e9' },
            borderBottom: tabValue === 0 ? '2px solid #0ea5e9' : 'none',
        }}/>
          <Tab_1.default label="Unpaid" sx={{
            textTransform: 'none',
            minHeight: 48,
            borderBottom: tabValue === 1 ? '2px solid #0ea5e9' : 'none',
            '&.Mui-selected': { color: '#0ea5e9' }
        }}/>
          <Tab_1.default label="Paid" sx={{
            textTransform: 'none',
            minHeight: 48,
            borderBottom: tabValue === 2 ? '2px solid #0ea5e9' : 'none',
            '&.Mui-selected': { color: '#0ea5e9' }
        }}/>
          {selectedPurchaseDetails && (<Tab_1.default label="Purchase Details" sx={{
                textTransform: 'none',
                minHeight: 48,
                borderBottom: tabValue === 3 ? '2px solid #0ea5e9' : 'none',
                '&.Mui-selected': { color: '#0ea5e9' }
            }}/>)}
        </Tabs_1.default>
      </Box_1.default>

      {/* Purchases Table or Purchase Details */}
      {tabValue === 3 && selectedPurchaseDetails ? (<Card_1.default sx={{ p: 3 }}>
          <Typography_1.default variant="h6" sx={{ mb: 2 }}>Purchase Details</Typography_1.default>
          <Grid_1.default container spacing={3}>
            <Grid_1.default item xs={12} md={6}>
              <Box_1.default sx={{ mb: 2 }}>
                <Typography_1.default variant="subtitle2" color="text.secondary">Invoice Number</Typography_1.default>
                <Typography_1.default variant="body1">{selectedPurchaseDetails.id}</Typography_1.default>
              </Box_1.default>
              <Box_1.default sx={{ mb: 2 }}>
                <Typography_1.default variant="subtitle2" color="text.secondary">Purchase Date</Typography_1.default>
                <Typography_1.default variant="body1">
                  {new Date(selectedPurchaseDetails.created_at).toLocaleDateString('en-US', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
            })}
                </Typography_1.default>
              </Box_1.default>
              <Box_1.default sx={{ mb: 2 }}>
                <Typography_1.default variant="subtitle2" color="text.secondary">Status</Typography_1.default>
                <Chip_1.default label={selectedPurchaseDetails.is_credit ? 'Credit' : 'Paid'} size="small" sx={{
                bgcolor: selectedPurchaseDetails.is_credit ? 'warning.100' : 'success.100',
                color: selectedPurchaseDetails.is_credit ? 'warning.main' : 'success.main',
                fontWeight: 500
            }}/>
              </Box_1.default>
            </Grid_1.default>
            <Grid_1.default item xs={12} md={6}>
              <Box_1.default sx={{ mb: 2 }}>
                <Typography_1.default variant="subtitle2" color="text.secondary">Supplier</Typography_1.default>
                <Typography_1.default variant="body1">{selectedPurchaseDetails.supplier.name}</Typography_1.default>
              </Box_1.default>
              <Box_1.default sx={{ mb: 2 }}>
                <Typography_1.default variant="subtitle2" color="text.secondary">Contact Info</Typography_1.default>
                <Typography_1.default variant="body1">{selectedPurchaseDetails.supplier.email}</Typography_1.default>
                <Typography_1.default variant="body1">{selectedPurchaseDetails.supplier.phone}</Typography_1.default>
              </Box_1.default>
              <Box_1.default sx={{ mb: 2 }}>
                <Typography_1.default variant="subtitle2" color="text.secondary">Total Amount</Typography_1.default>
                <Typography_1.default variant="body1">${parseFloat(selectedPurchaseDetails.total_amount).toFixed(2)}</Typography_1.default>
              </Box_1.default>
            </Grid_1.default>
          </Grid_1.default>
          
          <Box_1.default sx={{ mt: 3 }}>
            <Button_1.default variant="outlined" onClick={function () { return setTabValue(0); }} sx={{ mr: 1 }}>
              Back to Purchases
            </Button_1.default>
            <Button_1.default variant="contained" onClick={function () { return handleEditPurchase(selectedPurchaseDetails.id); }} sx={{ bgcolor: '#0ea5e9', '&:hover': { bgcolor: '#0284c7' } }}>
              Edit Purchase
            </Button_1.default>
          </Box_1.default>
        </Card_1.default>) : (<Card_1.default>
          <Table_1.default>
            <TableHead_1.default>
              <TableRow_1.default>
                <TableCell_1.default padding="checkbox">
                  <Checkbox_1.default checked={companyPurchases.length > 0 && selectedPurchases.length === companyPurchases.length} indeterminate={selectedPurchases.length > 0 && selectedPurchases.length < companyPurchases.length} onChange={handleSelectAll}/>
                </TableCell_1.default>
                <TableCell_1.default>Invoice Number</TableCell_1.default>
                <TableCell_1.default>Purchase Date</TableCell_1.default>
                <TableCell_1.default>Supplier</TableCell_1.default>
                <TableCell_1.default>Purchase Status</TableCell_1.default>
                <TableCell_1.default>Total Amount</TableCell_1.default>
                <TableCell_1.default>Paid Amount</TableCell_1.default>
                <TableCell_1.default>Due Amount</TableCell_1.default>
                <TableCell_1.default>Payment Status</TableCell_1.default>
                <TableCell_1.default>Action</TableCell_1.default>
              </TableRow_1.default>
            </TableHead_1.default>
            <TableBody_1.default>
              {isLoading ? (<TableRow_1.default>
                  <TableCell_1.default colSpan={10} align="center" sx={{ py: 3 }}>
                    <CircularProgress_1.default size={24}/>
                    <Typography_1.default sx={{ ml: 2 }}>Loading purchases...</Typography_1.default>
                  </TableCell_1.default>
                </TableRow_1.default>) : companyPurchases.length === 0 ? (<TableRow_1.default>
                  <TableCell_1.default colSpan={10} align="center" sx={{ py: 3 }}>
                    <Typography_1.default>No purchases found</Typography_1.default>
                  </TableCell_1.default>
                </TableRow_1.default>) : (companyPurchases.map(function (purchase) {
                var isSelected = selectedPurchases.includes(purchase.id);
                var isMenuOpen = Boolean(anchorElMap[purchase.id]);
                var formattedDate = new Date(purchase.created_at).toLocaleDateString('en-US', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric'
                }).replace(/\//g, '-');
                var displayStatus = purchase.is_credit ? 'Credit' : 'Paid';
                var displayPaymentStatus = purchase.is_credit ? 'Unpaid' : 'Paid';
                return (<TableRow_1.default hover key={purchase.id} selected={isSelected} onClick={function () { return handleRowClick(purchase); }} sx={{ cursor: 'pointer' }}>
                      <TableCell_1.default padding="checkbox" onClick={function (e) { return e.stopPropagation(); }}>
                        <Checkbox_1.default checked={isSelected} onChange={function () { return handleSelectOne(purchase.id); }}/>
                      </TableCell_1.default>
                      <TableCell_1.default>
                        <Typography_1.default variant="subtitle2">{purchase.id.substring(0, 8)}</Typography_1.default>
                      </TableCell_1.default>
                      <TableCell_1.default>{formattedDate}</TableCell_1.default>
                      <TableCell_1.default>{purchase.supplier.name}</TableCell_1.default>
                      <TableCell_1.default>
                        <Chip_1.default label={displayStatus} size="small" sx={{
                        bgcolor: displayStatus === 'Credit' ? 'warning.100' : 'success.100',
                        color: displayStatus === 'Credit' ? 'warning.main' : 'success.main',
                        fontWeight: 500
                    }}/>
                      </TableCell_1.default>
                      <TableCell_1.default>${parseFloat(purchase.total_amount).toFixed(2)}</TableCell_1.default>
                      <TableCell_1.default>$0.00</TableCell_1.default>
                      <TableCell_1.default>${parseFloat(purchase.total_amount).toFixed(2)}</TableCell_1.default>
                      <TableCell_1.default>
                        <Chip_1.default label={displayPaymentStatus} size="small" sx={{
                        bgcolor: displayPaymentStatus === 'Unpaid' ? 'error.100' : 'success.100',
                        color: displayPaymentStatus === 'Unpaid' ? 'error.main' : 'success.main',
                        fontWeight: 500
                    }}/>
                      </TableCell_1.default>
                      <TableCell_1.default onClick={function (e) { return e.stopPropagation(); }}>
                        <IconButton_1.default size="small" onClick={function (event) { return handleMenuOpen(event, purchase.id); }}>
                          <DotsThree_1.DotsThree />
                        </IconButton_1.default>
                        <Menu_1.default anchorEl={anchorElMap[purchase.id]} open={isMenuOpen} onClose={function () { return handleMenuClose(purchase.id); }}>
                          <MenuItem_1.default onClick={function () { return handleEditPurchase(purchase.id); }}>Edit</MenuItem_1.default>
                          <MenuItem_1.default onClick={function () { return handleDeletePurchase(purchase.id); }}>Delete</MenuItem_1.default>
                        </Menu_1.default>
                      </TableCell_1.default>
                    </TableRow_1.default>);
            }))}
            </TableBody_1.default>
          </Table_1.default>
        </Card_1.default>)}

      {/* Modals */}
      {isPurchaseModalOpen && currentPurchase && (<PurchaseEditModal_1.default open={isPurchaseModalOpen} onClose={function () { return setIsPurchaseModalOpen(false); }} onSave={handleSavePurchase} purchase={currentPurchase} isNew={!currentPurchase.id}/>)}
      
      <DeleteConfirmationModal_1.default open={isDeleteModalOpen} onClose={function () { return setIsDeleteModalOpen(false); }} onConfirm={handleConfirmDelete} title="Confirm Delete" message={"Are you sure you want to delete this purchase?"}/>
    </Box_1.default>);
}
