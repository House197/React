# AR-Product-Card

Componente creado en el curso de Fernando Herrera

### Arturo Rivera

## Ejemplo

```tsx
     <ProductCard
        product={product}
        initialValues={{
          count: 4,
          maxCount: 10,
        }}
      >
        {
          ({ reset, increaseBy, isMaxCountReached }) => (
            <>
              <ProductImage />
              <ProductTitle />
              <ProductButtons />
            </>
          )
        }
      </ProductCard>
```