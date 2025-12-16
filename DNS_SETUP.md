# DNS Configuration for admin.debtbox.sa

## Problem
GitHub Pages is showing: "Domain's DNS record could not be retrieved (InvalidDNSError)"

## Solution

You need to add a **CNAME record** in your DNS provider for the subdomain `admin.debtbox.sa`.

### Step 1: Find Your GitHub Pages URL

First, determine your GitHub Pages URL. It will be one of:
- `https://<username>.github.io` (for personal accounts)
- `https://<orgname>.github.io` (for organization accounts)
- Or the specific repository URL: `https://<orgname>.github.io/debtbox-admin`

### Step 2: Add DNS CNAME Record

Go to your DNS provider (where you manage `debtbox.sa`) and add:

**CNAME Record:**
```
Type: CNAME
Name: admin
Value: <your-org-or-username>.github.io
TTL: 3600 (or default)
```

**Example:**
- If your organization is `debtbox`, the value would be: `debtbox.github.io`
- If it's a personal account `yourusername`, the value would be: `yourusername.github.io`

### Step 3: Verify DNS Propagation

After adding the CNAME record, verify it's working:

```bash
# Check if CNAME record exists
dig admin.debtbox.sa CNAME

# Or use nslookup
nslookup -type=CNAME admin.debtbox.sa
```

You should see the CNAME pointing to your GitHub Pages URL.

**Note:** DNS changes can take up to 48 hours to propagate, but usually work within a few minutes to an hour.

### Step 4: Configure in GitHub

1. Go to your repository on GitHub
2. Navigate to **Settings** → **Pages**
3. Under **Custom domain**, enter: `admin.debtbox.sa`
4. Check **Enforce HTTPS** (this will be available after DNS is verified)
5. Save

### Step 5: Wait for Verification

GitHub will automatically verify the DNS record. This can take a few minutes to several hours. You'll see a green checkmark when it's verified.

## Troubleshooting

### If DNS still doesn't work after 24 hours:

1. **Double-check the CNAME value:**
   - Make sure it matches exactly: `<org-or-username>.github.io` (no `https://`, no trailing slash)
   - Case-sensitive: must be lowercase

2. **Check for conflicting records:**
   - Make sure there's no A record for `admin.debtbox.sa`
   - Make sure there's no other CNAME record conflicting

3. **Verify the GitHub Pages URL:**
   - Go to your repository → Settings → Pages
   - Check what URL GitHub shows for your site
   - The CNAME should point to that exact domain (without the repository path)

4. **Check DNS propagation:**
   - Use [dnschecker.org](https://dnschecker.org) to see if the CNAME is propagated globally
   - Make sure it's consistent across different DNS servers

### Common Mistakes:

❌ **Wrong:** `https://debtbox.github.io` (includes https://)  
✅ **Correct:** `debtbox.github.io`

❌ **Wrong:** `debtbox.github.io/debtbox-admin` (includes path)  
✅ **Correct:** `debtbox.github.io`

❌ **Wrong:** Using A record instead of CNAME  
✅ **Correct:** Use CNAME for subdomains

## Alternative: If Using Apex Domain

If you wanted to use `debtbox-admin.sa` (apex domain) instead of `admin.debtbox.sa` (subdomain), you would need:

**A Records:**
```
185.199.108.153
185.199.109.153
185.199.110.153
185.199.111.153
```

But for subdomains like `admin.debtbox.sa`, **always use CNAME**.

## After DNS is Verified

Once GitHub verifies your DNS:
1. The site will be accessible at `https://admin.debtbox.sa`
2. HTTPS will be automatically enabled
3. The CNAME file in the repository will be automatically managed by GitHub

