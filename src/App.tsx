import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { AdminRoute } from './components/auth/AdminRoute';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { AdminLayout } from './components/layout/AdminLayout';
import { PublicLayout } from './components/layout/PublicLayout';
import { AboutPage } from './pages/AboutPage';
import { BookingConfirmationPage } from './pages/BookingConfirmationPage';
import { BookingPage } from './pages/BookingPage';
import { ContactPage } from './pages/ContactPage';
import { ExplorePage } from './pages/ExplorePage';
import { FacilitiesPage } from './pages/FacilitiesPage';
import { GalleryPage } from './pages/GalleryPage';
import { HomePage } from './pages/HomePage';
import { NotFoundPage, PrivacyPage, TermsPage } from './pages/LegalPages';
import { LoginPage } from './pages/LoginPage';
import { RoomDetailPage } from './pages/RoomDetailPage';
import { RoomsPage } from './pages/RoomsPage';
import { MyBookingsPage } from './pages/account/MyBookingsPage';
import { ProfilePage } from './pages/account/ProfilePage';
import { AdminAvailabilityPage } from './pages/admin/AdminAvailabilityPage';
import { AdminBookingsPage } from './pages/admin/AdminBookingsPage';
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { AdminGalleryPage } from './pages/admin/AdminGalleryPage';
import { AdminRoomsPage } from './pages/admin/AdminRoomsPage';
import { AdminSettingsPage } from './pages/admin/AdminSettingsPage';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [pathname]);
  return null;
}

export default function App() {
  return (
    <>
      <ScrollToTop />
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-gold-400 focus:px-4 focus:py-2">
        Skip to content
      </a>
      <div id="main">
        <Routes>
          <Route element={<PublicLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/rooms" element={<RoomsPage />} />
            <Route path="/rooms/:roomId" element={<RoomDetailPage />} />
            <Route path="/gallery" element={<GalleryPage />} />
            <Route path="/facilities" element={<FacilitiesPage />} />
            <Route path="/explore" element={<ExplorePage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/book" element={<BookingPage />} />
            <Route path="/book/confirmation/:reference" element={<BookingConfirmationPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/privacy" element={<PrivacyPage />} />
            <Route path="/terms" element={<TermsPage />} />
            <Route
              path="/account/profile"
              element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/account/bookings"
              element={
                <ProtectedRoute>
                  <MyBookingsPage />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminLayout />
              </AdminRoute>
            }
          >
            <Route index element={<AdminDashboardPage />} />
            <Route path="bookings" element={<AdminBookingsPage />} />
            <Route path="rooms" element={<AdminRoomsPage />} />
            <Route path="availability" element={<AdminAvailabilityPage />} />
            <Route path="gallery" element={<AdminGalleryPage />} />
            <Route path="settings" element={<AdminSettingsPage />} />
          </Route>
          <Route path="/account" element={<Navigate to="/account/bookings" replace />} />
        </Routes>
      </div>
    </>
  );
}
