import unittest
from models import safe_span,allocate_model,Region,virtual_access,thread_counter,HandleTable,resolve_library,parse_pe,fake_pe,kernel_boundary,capstone

class LocalModels(unittest.TestCase):
    def test_pointers(self):
        self.assertEqual(safe_span(8,8),8)
        for x in ((8,9,True),(8,1,False),(8,-1,True)):
            with self.assertRaises(ValueError):safe_span(*x)
    def test_ownership(self):
        self.assertEqual(allocate_model()['freed'],1)
        self.assertEqual(allocate_model(False),{'used':0,'freed':0,'failed':True})
    def test_page_rights(self):
        r=Region(0x1000,0x1000,frozenset({'READ'}))
        self.assertTrue(virtual_access(r,0x1100,1,'READ'))
        self.assertFalse(virtual_access(r,0x1100,1,'WRITE'))
        self.assertFalse(virtual_access(r,0x2000,1,'READ'))
        self.assertFalse(virtual_access(r,0x1fff,2,'READ'))
    def test_threads(self):
        self.assertEqual(thread_counter(),200)
        self.assertEqual(thread_counter(3,7),21)
    def test_win_handles(self):
        t=HandleTable();h=t.open('own-file')
        with self.assertRaises(PermissionError):t.open('other-file',False)
        self.assertEqual(len(t.items),1)
        t.close(h)
        with self.assertRaises(ValueError):t.close(h)
    def test_dll_policy(self):
        self.assertTrue(resolve_library('HELPER.DLL').endswith('helper.dll'))
        for name in ('../helper.dll','other.dll',r'C:\Users\Public\helper.dll'):
            with self.assertRaises(PermissionError):resolve_library(name)
    def test_pe_valid_and_invalid(self):
        self.assertEqual(parse_pe(fake_pe())['machine'],0x8664)
        for bad in [fake_pe()[:20],b'abcd']:
            with self.assertRaises(ValueError):parse_pe(bad)
        d=bytearray(fake_pe());d[0x3c:0x40]=b'\xff'*4
        with self.assertRaises(ValueError):parse_pe(d)
    def test_user_kernel_boundary(self):
        self.assertEqual(kernel_boundary(8,8,{'READ'},'READ'),8)
        with self.assertRaises(PermissionError):kernel_boundary(8,1,{'READ'},'WRITE')
        with self.assertRaises(ValueError):kernel_boundary(8,32,{'READ'},'READ')
    def test_capstone(self):
        self.assertTrue(capstone({'READ'},'READ','helper.dll')['closed'])
        with self.assertRaises(PermissionError):capstone({'READ'},'WRITE','helper.dll')
        with self.assertRaises(PermissionError):capstone({'READ'},'READ',r'C:\Users\Public\helper.dll')
