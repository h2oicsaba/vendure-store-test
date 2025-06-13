# Lokális Docker indítás

Az alábbi parancsokkal indítható a projekt Docker környezete. A `sudo` használata opcionális, ha a felhasználó tagja a `docker` csoportnak.

```bash
# Futtó konténerek leállítása és a hozzájuk tartozó kötetek törlése
sudo docker compose down --volumes

# A konténerekhez tartozó képek újraépítése gyorsítótár nélkül
sudo docker compose build --no-cache

# A szolgáltatások elindítása a háttérben
sudo docker compose up -d

# A vendure szolgáltatás naplóinak követése
sudo docker compose logs -f vendure
```

A `docker compose logs -f vendure` parancs helyett bármely más szolgáltatás nevével is kérhetőek a logok.
