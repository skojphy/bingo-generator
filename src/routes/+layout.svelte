<script lang="ts">
	import '../app.css';

	let { children } = $props();
</script>

{@render children()}

<footer class="footer">
  <div class="footer-content">
    <span>&copy; {new Date().getFullYear()} Seohey. All rights reserved.</span>
    <span class="footer-contact">문의: <a href="mailto:seohey@kakao.com">seohey@kakao.com</a></span>
  </div>
</footer>

<style>
.footer {
  width: 100vw;
  background: #f5f5f5;
  border-top: 1.5px solid #e0e0e0;
  padding: 24px 0 18px 0;
  margin-top: 48px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.footer-content {
  color: #666;
  font-size: 1em;
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.footer-contact a {
  color: #2f8466;
  text-decoration: underline;
}
:global(html), :global(body) {
  min-width: 380px;
  width: 100vw;
  overflow-x: auto;
  box-sizing: border-box;
}
main {
  min-width: 380px;
  width: 100%;
  overflow-x: auto;
  box-sizing: border-box;
}
</style>
