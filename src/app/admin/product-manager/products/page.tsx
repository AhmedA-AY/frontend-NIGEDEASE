'use client';

import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableContainer from '@mui/material/TableContainer';
import Checkbox from '@mui/material/Checkbox';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import Chip from '@mui/material/Chip';
import { SquaresFour as SquaresIcon } from '@phosphor-icons/react/dist/ssr/SquaresFour';
import { Plus as PlusIcon } from '@phosphor-icons/react/dist/ssr/Plus';
import { PencilSimple as PencilSimpleIcon } from '@phosphor-icons/react/dist/ssr/PencilSimple';
import { Trash as TrashIcon } from '@phosphor-icons/react/dist/ssr/Trash';
import { Export as ExportIcon } from '@phosphor-icons/react/dist/ssr/Export';
import { MagnifyingGlass as MagnifyingGlassIcon } from '@phosphor-icons/react/dist/ssr/MagnifyingGlass';
import { Eye as EyeIcon } from '@phosphor-icons/react/dist/ssr/Eye';
import { paths } from '@/paths';

export default function ProductsPage(): React.JSX.Element {
  const [selectedProducts, setSelectedProducts] = React.useState<number[]>([]);
  const [searchTerm, setSearchTerm] = React.useState<string>('');
  const [categoryFilter, setCategoryFilter] = React.useState<string>('');
  const [stockFilter, setStockFilter] = React.useState<string>('');
  
  // Sample data - replace with actual data fetching
  const products = [
    { id: 1, name: 'Product 1', category: 'Electronics', brand: 'Brand A', price: 299.99, stock: 25 },
    { id: 2, name: 'Product 2', category: 'Clothing', brand: 'Brand B', price: 59.99, stock: 42 },
    { id: 3, name: 'Product 3', category: 'Home & Garden', brand: 'Brand C', price: 129.99, stock: 18 },
    { id: 4, name: 'Product 4', category: 'Electronics', brand: 'Brand A', price: 499.99, stock: 10 },
    { id: 5, name: 'Product 5', category: 'Clothing', brand: 'Brand D', price: 79.99, stock: 30 },
    { id: 6, name: 'Product 6', category: 'Furniture', brand: 'Brand E', price: 899.99, stock: 5 },
    { id: 7, name: 'Product 7', category: 'Electronics', brand: 'Brand F', price: 149.99, stock: 0 },
    { id: 8, name: 'Product 8', category: 'Beauty', brand: 'Brand G', price: 29.99, stock: 75 },
    { id: 9, name: 'Product 9', category: 'Clothing', brand: 'Brand B', price: 49.99, stock: 20 },
    { id: 10, name: 'Product 10', category: 'Home & Garden', brand: 'Brand C', price: 89.99, stock: 15 },
  ];

  // Get unique categories for filtering
  const categories = Array.from(new Set(products.map(product => product.category)));

  // Filter products based on search term and filters
  const filteredProducts = products.filter(product => {
    const matchesSearch = 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.brand.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = !categoryFilter || product.category === categoryFilter;
    
    const matchesStock = !stockFilter || 
      (stockFilter === 'in-stock' && product.stock > 0) ||
      (stockFilter === 'out-of-stock' && product.stock === 0) ||
      (stockFilter === 'low-stock' && product.stock > 0 && product.stock <= 10);
    
    return matchesSearch && matchesCategory && matchesStock;
  });

  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      setSelectedProducts(filteredProducts.map(product => product.id));
    } else {
      setSelectedProducts([]);
    }
  };

  const handleSelectOne = (id: number) => {
    if (selectedProducts.includes(id)) {
      setSelectedProducts(selectedProducts.filter(productId => productId !== id));
    } else {
      setSelectedProducts([...selectedProducts, id]);
    }
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleCategoryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCategoryFilter(event.target.value);
  };

  const handleStockChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setStockFilter(event.target.value);
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    setCategoryFilter('');
    setStockFilter('');
  };

  const handleAddProduct = () => {
    // In a real application, this would navigate to add product form
    alert('Navigate to add product form');
  };

  const handleEditProduct = (id: number) => {
    // In a real application, this would navigate to edit product form
    alert(`Edit product with ID: ${id}`);
  };

  const handleViewProduct = (id: number) => {
    // In a real application, this would navigate to product details
    alert(`View product with ID: ${id}`);
  };

  const handleDeleteProduct = (id: number) => {
    // In a real application, this would call an API to delete the product
    alert(`Delete product with ID: ${id}`);
  };

  const handleExportProducts = () => {
    // In a real application, this would export products to CSV/Excel
    alert('Export products to CSV/Excel');
  };

  // Generate breadcrumb path links
  const breadcrumbItems = [
    { label: 'Dashboard', url: paths.admin.dashboard },
    { label: 'Product Manager', url: paths.admin.productManager },
    { label: 'Products', url: paths.admin.products },
  ];

  return (
    <Box component="main" sx={{ flexGrow: 1, py: 3 }}>
      {/* Header and Breadcrumbs */}
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <SquaresIcon size={28} weight="bold" style={{ marginRight: '8px', color: '#0ea5e9' }} />
            <Typography variant="h4">Products</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', color: 'text.secondary' }}>
            {breadcrumbItems.map((item, index) => (
              <React.Fragment key={index}>
                {index > 0 && <Box component="span" sx={{ mx: 0.5 }}>-</Box>}
                <Typography 
                  component="a" 
                  href={item.url} 
                  variant="body2" 
                  color={index === breadcrumbItems.length - 1 ? 'text.primary' : 'inherit'}
                  sx={{ textDecoration: 'none' }}
                >
                  {item.label}
                </Typography>
              </React.Fragment>
            ))}
          </Box>
        </Box>
        <Stack direction="row" spacing={2}>
          <Button
            variant="outlined"
            startIcon={<ExportIcon weight="bold" />}
            onClick={handleExportProducts}
          >
            Export
          </Button>
          <Button 
            variant="contained" 
            startIcon={<PlusIcon weight="bold" />}
            sx={{ bgcolor: '#0ea5e9', '&:hover': { bgcolor: '#0284c7' } }}
            onClick={handleAddProduct}
          >
            Add Product
          </Button>
        </Stack>
      </Box>

      {/* Search and Filters */}
      <Card sx={{ mb: 3, p: 2 }}>
        <Grid container spacing={2} alignItems="flex-end">
          <Grid item xs={12} md={4}>
            <OutlinedInput
              placeholder="Search products..."
              fullWidth
              value={searchTerm}
              onChange={handleSearchChange}
              startAdornment={
                <InputAdornment position="start">
                  <MagnifyingGlassIcon size={20} />
                </InputAdornment>
              }
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel id="category-label">Category</InputLabel>
              <Select
                labelId="category-label"
                id="category-select"
                value={categoryFilter}
                label="Category"
                onChange={handleCategoryChange as any}
              >
                <MenuItem value="">All Categories</MenuItem>
                {categories.map(category => (
                  <MenuItem key={category} value={category}>{category}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel id="stock-label">Stock Status</InputLabel>
              <Select
                labelId="stock-label"
                id="stock-select"
                value={stockFilter}
                label="Stock Status"
                onChange={handleStockChange as any}
              >
                <MenuItem value="">All Stock Status</MenuItem>
                <MenuItem value="in-stock">In Stock</MenuItem>
                <MenuItem value="out-of-stock">Out of Stock</MenuItem>
                <MenuItem value="low-stock">Low Stock (≤ 10)</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={2}>
            <Button 
              variant="text" 
              fullWidth
              onClick={handleResetFilters}
            >
              Reset Filters
            </Button>
          </Grid>
        </Grid>
      </Card>

      {/* Products Table */}
      <Card>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={filteredProducts.length > 0 && selectedProducts.length === filteredProducts.length}
                    indeterminate={selectedProducts.length > 0 && selectedProducts.length < filteredProducts.length}
                    onChange={handleSelectAll}
                  />
                </TableCell>
                <TableCell>Product Name</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Brand</TableCell>
                <TableCell>Price</TableCell>
                <TableCell>Stock</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredProducts.map((product) => (
                <TableRow key={product.id} hover>
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={selectedProducts.includes(product.id)}
                      onChange={() => handleSelectOne(product.id)}
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                      {product.name}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={product.category} 
                      size="small"
                      sx={{ 
                        bgcolor: 'rgba(14, 165, 233, 0.1)',
                        color: '#0284c7',
                      }}
                    />
                  </TableCell>
                  <TableCell>{product.brand}</TableCell>
                  <TableCell>${product.price.toFixed(2)}</TableCell>
                  <TableCell>
                    <Chip 
                      label={product.stock === 0 ? 'Out of Stock' : `${product.stock} in stock`}
                      size="small"
                      sx={{ 
                        bgcolor: product.stock === 0 
                          ? 'rgba(239, 68, 68, 0.1)' 
                          : product.stock <= 10 
                            ? 'rgba(245, 158, 11, 0.1)' 
                            : 'rgba(22, 163, 74, 0.1)',
                        color: product.stock === 0 
                          ? '#ef4444' 
                          : product.stock <= 10 
                            ? '#f59e0b' 
                            : '#16a34a',
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={1} justifyContent="center">
                      <IconButton
                        size="small"
                        sx={{
                          bgcolor: '#0ea5e9',
                          color: 'white',
                          '&:hover': { bgcolor: '#0284c7' }
                        }}
                        onClick={() => handleViewProduct(product.id)}
                      >
                        <EyeIcon size={18} />
                      </IconButton>
                      <IconButton
                        size="small"
                        sx={{
                          bgcolor: '#10b981',
                          color: 'white',
                          '&:hover': { bgcolor: '#059669' }
                        }}
                        onClick={() => handleEditProduct(product.id)}
                      >
                        <PencilSimpleIcon size={18} />
                      </IconButton>
                      <IconButton
                        size="small"
                        sx={{
                          bgcolor: '#ef4444',
                          color: 'white',
                          '&:hover': { bgcolor: '#dc2626' }
                        }}
                        onClick={() => handleDeleteProduct(product.id)}
                      >
                        <TrashIcon size={18} />
                      </IconButton>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
              {filteredProducts.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 3 }}>
                    <Typography variant="body1" color="text.secondary">
                      No products found matching your search and filters
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2 }}>
          <Box>
            {selectedProducts.length > 0 && (
              <Typography variant="subtitle2" color="text.secondary">
                {selectedProducts.length} {selectedProducts.length === 1 ? 'product' : 'products'} selected
              </Typography>
            )}
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography variant="body2" color="text.secondary">
              <Button size="small" sx={{ minWidth: 'auto', p: 0 }}>&lt;</Button>
              <Button 
                size="small" 
                sx={{ 
                  minWidth: 24, 
                  height: 24, 
                  p: 0, 
                  mx: 0.5, 
                  border: '1px solid #0ea5e9', 
                  borderRadius: 1,
                  color: '#0ea5e9' 
                }}
              >
                1
              </Button>
              <Button size="small" sx={{ minWidth: 'auto', p: 0 }}>&gt;</Button>
            </Typography>
            <Typography variant="body2" color="text.secondary">
              10 / page <Box component="span" sx={{ ml: 0.5, cursor: 'pointer' }}>▼</Box>
            </Typography>
          </Box>
        </Box>
      </Card>
    </Box>
  );
} 